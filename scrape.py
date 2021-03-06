from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
import io
from PIL import Image
import time
import json
import os
import sys    
import shutil

imgsPath = "./imgs"
videoImgsPath = "./videoimgs"

imgsPathExist = os.path.exists(imgsPath)
if not imgsPathExist:
    os.makedirs(imgsPath)
    
videoImgsPathExist = os.path.exists(videoImgsPath)
if not videoImgsPathExist:
    os.makedirs(videoImgsPath)

while True:
  try:
    inputImages = int(input("How many images: "))
    break
  except ValueError:
      print("Input a integer.")  
      continue
  
while True:
  try:
    inputAudio = int(input("How many audios in the audio folder: "))
    break
  except ValueError:
      print("Input a integer.")  
      continue

while True:
  try:
    inputDelay = float(input("Delay between image downloads in seconds (Recommended: 1): "))
    break
  except ValueError:
      print("Input a integer or decimal.")  
      continue

while True:
  try:
    lengthInput = float(input("Length each image is on screen for: "))
    break
  except ValueError:
      print("Input a integer or decimal.")  
      continue
  
agreeInput = input("Continuing will wipe the imgs and videoimgs folder. Continue? (y/n) ")

if agreeInput != "y":
    configFile = open("config.json", "w")
    configFile.write('{"exit": 1}')
    configFile.close()
    sys.exit("Did not continue.")    
else:
    shutil.rmtree(imgsPath)
    os.mkdir(imgsPath)
    
    shutil.rmtree(videoImgsPath)
    os.mkdir(videoImgsPath)

configFile = open("config.json", "w")
configFile.write('{"length": ' + str(lengthInput))
configFile.close()
configFile = open("config.json", "a")
configFile.write(', "images": ' + str(inputImages))
configFile.write(', "audios": ' + str(inputAudio)+'}')
configFile.close() 

driverPath = ".\\chromedriver.exe"

wd = webdriver.Chrome(driverPath)

def getGoogleImages(wd, delay, max_images):
    def scroll(wd):
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(delay)
        
    search_url = "https://www.google.com/search?q=cheese&sxsrf=ALiCzsY_5OnGntkzP38PnC9UZmeibeTA8w:1653008252984&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjlhevN7-z3AhV5RWwGHX_sARwQ_AUoAXoECAIQAw&biw=1920&bih=927"
    wd.get(search_url)
    
    image_urls = set()
    skips = 0
    
    while len(image_urls) + skips < max_images:
        scroll(wd)
        
        thumbnails = wd.find_elements(By.CLASS_NAME, "Q4LuWd")
        
        for img in thumbnails[len(image_urls) + skips: max_images]:
            try:
                img.click()
                time.sleep(delay)
                
            except:
                continue
            
            images = wd.find_elements(By.CLASS_NAME, "n3VNCb")
            for image in images:
                if image.get_attribute('src') in image_urls:
                    max_images += 1
                    skips += 1
                    break
                if image.get_attribute('src') and 'http' in image.get_attribute('src'):
                    image_urls.add(image.get_attribute('src'))
                    print(f"got {len(image_urls)}")
        print(f"done scraping {len(image_urls)} images")
                    
    return image_urls




def dlImage(download_path, url, file_name):
    try:
        image_content = requests.get(url).content
        image_file = io.BytesIO(image_content)
        image = Image.open(image_file)
        file_path = download_path + file_name
        
        with open(file_path, "wb") as f:
            image.save(f, "PNG")
        
        print("it worked!?")
    except Exception as e:
        print("failed: ", e)
    
urls = getGoogleImages(wd, inputDelay, inputImages)


for i, url in enumerate(urls):
    dlImage("imgs/", url ,str(i) + ".png")
    
wd.quit()