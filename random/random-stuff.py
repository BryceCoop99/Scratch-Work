file_path = 'new_file.txt'  # This file doesn't exist yet

with open(file_path, 'w') as file:
    file.write("Hello, world!\n")
    file.write(f"This is a new file.")