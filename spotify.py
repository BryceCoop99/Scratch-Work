import pyautogui
import time

def play_and_reset_song():
    # Coordinates for the play button and the song in the middle of the screen
    play_button = (960, 930)
    song_middle = (960, 550)
    
    # Click the play button
    pyautogui.click(*play_button)
    time.sleep(40)  # Let the song play for 40 seconds
    
    # Click the song in the middle of the screen to reset and play again
    pyautogui.click(*song_middle)

# Main program
while True:
    play_and_reset_song()
