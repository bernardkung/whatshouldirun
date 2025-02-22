import os

filenames = os.listdir('./public/images/class_icons/')

for filename in filenames:
  old_file = os.path.join(f'./public/images/class_icons/{filename}')
  new_file = os.path.join(f'./public/images/class_icons/{filename.replace("_", "-")}')
  os.rename(old_file, new_file)