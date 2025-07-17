# backend/detector.py
import cv2
import easyocr

def detect_plate(image_path):
    reader = easyocr.Reader(['en'])
    img = cv2.imread(image_path)

    # For YOLO: load model, detect plate, crop region
    # For simple: use Haar Cascade
    # Example simple plate detection using Haar:
    plate_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_russian_plate_number.xml')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plates = plate_cascade.detectMultiScale(gray, 1.1, 4)

    for (x, y, w, h) in plates:
        plate_img = img[y:y+h, x:x+w]
        cv2.imwrite('backend/uploads/cropped_plate.jpg', plate_img)
        result = reader.readtext(plate_img)
        if result:
            return result[0][-2]  # Plate text
    return None
