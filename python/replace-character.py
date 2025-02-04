import os

#
def replace_space_with_dash(directory):
    for filename in os.listdir(directory):
        if ' ' in filename:
            new_filename = filename.replace(' ', '-')
            os.rename(os.path.join(directory, filename), os.path.join(directory, new_filename))

directory_path = 'media/life-transforming-messages'
replace_space_with_dash(directory_path)