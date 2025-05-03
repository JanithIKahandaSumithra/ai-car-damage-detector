from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List
from PIL import Image
import torch
from torchvision import transforms, models
from io import BytesIO
import numpy as np

# Initialize FastAPI app
app = FastAPI()

# Define the CarDamageModel
class CarDamageModel(torch.nn.Module):
    def __init__(self, num_classes):
        super(CarDamageModel, self).__init__()
        # Update to use 'weights' parameter
        self.resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
        num_ftrs = self.resnet.fc.in_features
        self.resnet.fc = torch.nn.Linear(num_ftrs, num_classes)

    def forward(self, x):
        return torch.sigmoid(self.resnet(x))

# Initialize the model
model = CarDamageModel(num_classes=14)

# Load the model weights
model.load_state_dict(torch.load('car_damage_model.pth', map_location=torch.device('cpu')))
model.eval()

# Define transforms for image preprocessing
data_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Define the root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Car Damage Detection API. Use the /predict/ endpoint to submit an image for analysis."}

# Define the endpoint for image upload and prediction
@app.post("/predict/")
async def predict_damage(file: UploadFile = File(...)):
    # Read and preprocess the image
    image = Image.open(BytesIO(await file.read())).convert('RGB')
    image = data_transforms(image).unsqueeze(0)
    
    # Perform the prediction
    with torch.no_grad():
        outputs = model(image)
        preds = (outputs > 0.5).float().squeeze().cpu().numpy()
    
    # Define damage types
    damage_types = [
        "bonnet-dent", "boot-dent", "doorouter-dent", "fender-dent", "front-bumper-dent",
        "Front-windscreen-damage", "Headlight-damage", "quaterpanel-dent", "rear-bumper-dent",
        "Rear-windscreen-Damage", "roof-dent", "Runningboard-Damage", "Sidemirror-Damage",
        "Taillight-Damage"
    ]
    
    # Get predicted damages
    predicted_damages = [damage_types[i] for i, pred in enumerate(preds) if pred == 1]
    
    return {"predicted_damages": predicted_damages}
