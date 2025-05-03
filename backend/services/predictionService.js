const axios = require('axios');
const FormData = require('form-data');

class PredictionService {
  constructor() {
    this.apiUrl = process.env.FASTAPI_URL;
  }

  async predictDamage(imageBuffer) {
    try {
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      });

      const response = await axios.post(`${this.apiUrl}/predict/`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return response.data.predicted_damages;
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to get damage prediction');
    }
  }
}

module.exports = new PredictionService();
