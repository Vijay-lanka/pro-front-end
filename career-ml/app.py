from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
label_encoder = joblib.load("model/label_encoder.pkl")


app = FastAPI()

# Load model and vectorizer
try:
    model = joblib.load("model/career_model.pkl")
    vectorizer = joblib.load("model/vectorizer.pkl")
except Exception as e:
    print("Error loading model/vectorizer:", e)
    model = None
    vectorizer = None

# Input schema
class CareerInput(BaseModel):
    experience: int
    education: str
    skills: list[str]

# Prepare features
def prepare_features(input_data: CareerInput):
    # Transform skills using vectorizer
    skills_text = " ".join(input_data.skills)
    skills_vector = vectorizer.transform([skills_text]).toarray()

    # Combine numeric/categorical features
    X = np.hstack([
        np.array([[input_data.experience]]),
        np.array([[len(input_data.education)]]),  # example encoding
        skills_vector
    ])

    # Ensure X has correct number of features
    expected_features = model.n_features_in_
    if X.shape[1] < expected_features:
        X = np.hstack([X, np.zeros((1, expected_features - X.shape[1]))])
    elif X.shape[1] > expected_features:
        X = X[:, :expected_features]

    # Convert to DataFrame with original feature names
    X_df = pd.DataFrame(X, columns=model.feature_names_in_)

    return X_df

@app.get("/")
def root():
    return {"status": "ML API running"}

@app.post("/predict")
def predict_career(input_data: CareerInput):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        X = prepare_features(input_data)
        probs = model.predict_proba(X)[0]
        classes = model.classes_

        # Map career → probability
        career_probs = {
            label_encoder.inverse_transform([career])[0]: float(prob)
            for career, prob in zip(classes, probs)
        }


        # 🔝 Sort & take Top-3
        top_3 = sorted(
            career_probs.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        return {
            "top_3_recommendations": [
                {"career": career, "confidence": round(conf, 4)}
                for career, conf in top_3
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
