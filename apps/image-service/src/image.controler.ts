import { imageService } from "./image.service";
export const imageControler = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded.");
      const fileName = await imageService.processAndUploadImage(
        req.file.buffer
      );
      //send file name to service
      res.send({ message: "Image uploaded successfully", fileName });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading image.");
    }
  },

  getImage: async (req, res) => {
    //as stream
    try {
      const stream = await imageService.getImageStream(req.query.fileName);
      stream.pipe(res);
    } catch (err) {
      console.error(err);
      res.status(404).send("Image not found.");
    }
  },

  deleteImage: async (req, res) => {
    try {
      await imageService.deleteImage(req.query.fileName);
      res.send({ message: "Image deleted successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting image.");
    }
  },

  updateImage: async (req, res) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded.");

      const newFileName = await imageService.updateImage(
        req.query.fileName,
        req.file.buffer
      );
      //send file name to service

      res.send({
        message: "Image updated successfully.",
        fileName: newFileName,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating image.");
    }
  },
  getImageUrl: async (req, res) => {
    try {
      const url = await imageService.getImageUrl(req.query.fileName);
      res.send({ url });
    } catch (err) {
      res.status(500).send("Error generating image URL.");
    }
  },
};
