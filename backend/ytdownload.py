from pytubefix import YouTube
from pytubefix.cli import on_progress


url1 = 'https://youtu.be/DuAmmwDMmgg?si=49p_ykAzoBqpnEh1'
url2 = 'https://youtu.be/xAt1xcC6qfM'


yt = YouTube(url2,on_progress_callback= on_progress)
print(yt.title)
ys = yt.streams.get_highest_resolution()

ys.download()