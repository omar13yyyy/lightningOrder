import app from './app';
function server(){
const PORT: number = parseInt(process.env.PORT || '3000');

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
}

export default server