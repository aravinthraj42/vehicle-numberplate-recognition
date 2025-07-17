import cv2
import easyocr
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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
            for bbox, text, prob in result:
                logger.info(f"Detected text: {text} (confidence: {prob})")
            plate_text = " ".join([text for _, text, _ in result])
            return plate_text
        else:
            logger.warning("No text detected in image")
            return None

    except Exception as e:
        logger.error(f"Error in detect_plate: {str(e)}")
        return None
