import streamlit as st
import requests
from PIL import Image
import io

# FastAPI endpoint URL
API_URL = "http://127.0.0.1:8000/predict/"

st.title("🚗 Car Damage Detection")

# File uploader in Streamlit
uploaded_file = st.file_uploader("📤 Upload an image of the damaged car", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # Display the uploaded image
    image = Image.open(uploaded_file)

    # Convert the uploaded image to RGB before saving
    if image.mode != 'RGB':
        image = image.convert('RGB')

    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Convert image to bytes for FastAPI request
    img_bytes = io.BytesIO()
    image.save(img_bytes, format="JPEG")
    img_bytes = img_bytes.getvalue()

    # Button to make a prediction
    if st.button("🔍 Analyze Damage"):
        # Send POST request to FastAPI app
        response = requests.post(API_URL, files={"file": ("image.jpg", img_bytes, "image/jpeg")})

        if response.status_code == 200:
            # Show the predicted damages
            prediction = response.json()
            predicted_damages = prediction.get("predicted_damages", [])

            if predicted_damages:
                st.success(f"🔧 **Damage Detected!** {len(predicted_damages)} damages found.")
                st.write("### 🚗 **Predicted Car Damages**:")

                # Display the damages in a nice format with checkmarks
                for damage in predicted_damages:
                    st.write(f"- ✅ {damage.replace('-', ' ').capitalize()}")
            else:
                st.warning("No damages detected. The car seems to be in good condition.")
        else:
            st.error("❌ Error in prediction. Please try again.")
