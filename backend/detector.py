import cv2
import easyocr
import logging
import re

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def is_valid_plate(plate):
    # Normalize the text: remove dots, extra spaces
    plate = plate.replace('.', ' ').replace('-', ' ')
    plate = re.sub(r'\s+', ' ', plate).strip().upper()

    # Valid format: e.g., TN 69 BR 5531
    pattern = r"^[A-Z]{2}\s\d{2}\s[A-Z]{2}\s\d{4}$"
    return re.match(pattern, plate), plate  # Return both match and cleaned plate


def detect_plate(image_path):
    logger.info(f"Processing image: {image_path}")
    try:
        img = cv2.imread(image_path)
        if img is None:
            logger.error(f"Failed to load image at {image_path}")
            return None

        logger.info("Initializing EasyOCR")
        reader = easyocr.Reader(['en'])
        logger.info("EasyOCR initialized")

        result = reader.readtext(img)
        logger.info(f"EasyOCR result: {result}")

        if result:
            texts = [text[1] for text in result]  # get only the detected string
            plate_text_raw = " ".join(texts)
            logger.info(f"Raw combined text: {plate_text_raw}")

            valid, cleaned_plate = is_valid_plate(plate_text_raw)
            if valid:
                logger.info(f"Valid plate detected: {cleaned_plate}")
                return cleaned_plate
            else:
                logger.warning("Detected plate does not match expected format")
                return None
        else:
            logger.warning("No text detected in image")
            return None
    except Exception as e:
        logger.error(f"Error while processing image: {e}")
        return None
