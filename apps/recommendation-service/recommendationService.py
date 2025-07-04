pip install pandas numpy scikit-learn tensorflow joblib flask flask-cors faiss-cpu
python train_autoencoder.py
python app.py

--------------------------------------------------------------------------







import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer, OneHotEncoder, MinMaxScaler
from sklearn.preprocessing import normalize
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import joblib

# ------------------------------
# 1. تحميل بيانات المنتجات من JSON
with open("products.json", "r") as f:
    data = json.load(f)

df = pd.DataFrame(data)



# ------------------------------
# 2. المعالجة المسبقة

category_encoder = OneHotEncoder(sparse_output=False)
category_encoded = category_encoder.fit_transform(df[["category"]])

mlb = MultiLabelBinarizer()
tags_encoded = mlb.fit_transform(df["tags"])

scaler = MinMaxScaler()
price_scaled = scaler.fit_transform(df[["price"]])

X = np.concatenate([category_encoded, tags_encoded, price_scaled], axis=1)

# ------------------------------
# 3. بناء Autoencoder
input_dim = X.shape[1]
layer1_dim = 64
encoding_dim = 32

input_layer = Input(shape=(input_dim,))
encoded = Dense(layer1_dim, activation='relu')(input_layer)
encoded = Dense(encoding_dim, activation='relu')(encoded)
decoded = Dense(layer1_dim, activation='relu')(encoded)
output_layer = Dense(input_dim, activation='sigmoid')(decoded)

autoencoder = Model(input_layer, output_layer)
autoencoder.compile(optimizer=Adam(0.001), loss='mse')

# ------------------------------
# 4. تدريب النموذج مع EarlyStopping
early_stopping = EarlyStopping(monitor='loss', patience=10, restore_best_weights=True)
autoencoder.fit(X, X, epochs=100, batch_size=8, shuffle=True, callbacks=[early_stopping])

# ------------------------------
# 5. استخراج encoder
encoder_model = Model(inputs=input_layer, outputs=encoded)

# ------------------------------
# 6. حفظ الملفات
df.to_csv("original_products.csv", index=False)
np.save("X.npy", X)
autoencoder.save("autoencoder_model.h5")
encoder_model.save("encoder_model.h5")
joblib.dump(category_encoder, "category_encoder.pkl")
joblib.dump(mlb, "mlb.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Training complete and files saved.")
----------------------------------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
import faiss
import ast
from sklearn.preprocessing import normalize

app = Flask(__name__)
CORS(app)

# تحميل النماذج وأدوات المعالجة
autoencoder = tf.keras.models.load_model('autoencoder_model.h5')
encoder_model = tf.keras.models.load_model('encoder_model.h5')
scaler = joblib.load('scaler.pkl')
mlb = joblib.load('mlb.pkl')
cat_encoder = joblib.load('category_encoder.pkl')

# تحميل البيانات الأصلية
df = pd.read_csv("original_products.csv")

# تحويل عمود tags من نص لقائمة
df['tags'] = df['tags'].apply(ast.literal_eval)

def preprocess_input_batch(df_products):
    categories = cat_encoder.transform(df_products[['category']]).toarray()
    tags = mlb.transform(df_products['tags'])
    prices = scaler.transform(df_products[['price']])
    features = np.concatenate([categories, tags, prices], axis=1)
    return features

# تجهيز كل البيانات دفعة واحدة
X_all = preprocess_input_batch(df)
product_embeddings = encoder_model.predict(X_all)
product_embeddings = normalize(product_embeddings, norm='l2')

# بناء فهرس FAISS
embedding_dim = product_embeddings.shape[1]
index = faiss.IndexFlatIP(embedding_dim)
index.add(product_embeddings.astype('float32'))

def preprocess_input(product):
    category = cat_encoder.transform([[product['category']]]).toarray()
    tags = mlb.transform([product['tags']])
    price = scaler.transform([[product['price']]])
    features = np.concatenate([category, tags, price], axis=1)
    return features

@app.route('/recommend', methods=['POST'])
def recommend():
    product = request.json
    input_vector = preprocess_input(product)
    embedded = encoder_model.predict(input_vector)
    embedded = normalize(embedded, norm='l2')

    D, I = index.search(embedded.astype('float32'), 6)  # 1 نفسه + 5 توصيات
    top_indices = I[0][1:]  # تجاهل المنتج نفسه

    recommendations = df.iloc[top_indices][['name', 'category', 'price']].to_dict(orient='records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5000)
    
    ---------------------------------------------------------------------
    {
  "name": "iPhone 14",
  "category": "Smartphones",
  "tags": ["Apple", "iOS", "Mobile"],
  "price": 999.99
	}
