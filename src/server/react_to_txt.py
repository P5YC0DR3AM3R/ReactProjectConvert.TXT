import os
import sys

def create_txt_from_react_app(root_folder, output_file="appOutput.txt"):
    """Creates a single TXT file from the contents of a React app folder.

    Args:
        root_folder: The path to the root directory of the React app.
        output_file: The name of the output TXT file (optional).
    """

    with open(output_file, "w", encoding="utf-8") as outfile:
        for dirpath, _, filenames in os.walk(root_folder):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)

                if any(folder in filepath for folder in ["node_modules", ".git", "build", "Node", "dist"]):
                    continue 
                if filename.startswith("._"):
                    continue

                relative_path = os.path.relpath(filepath, root_folder)

                outfile.write(f"\n\n{relative_path}\n\n")  # Two line breaks before

                with open(filepath, "r", encoding="utf-8") as infile:
                    for line in infile:
                        outfile.write(f" {line}")  # Space before each line of code

if __name__ == "__main__":
    app_folder = sys.argv[1]
    output_file = sys.argv[2]
    create_txt_from_react_app(app_folder, output_file)
