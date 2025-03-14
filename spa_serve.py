import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "build/client"  # Change this to your build directory

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Check if the requested file exists
        file_path = self.translate_path(self.path)
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            # If the file doesn't exist or is a directory, serve index.html
            self.path = '/index.html'
        return super().do_GET()

if __name__ == "__main__":
    print(f"Serving SPA from {DIRECTORY} at http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        httpd.serve_forever()
