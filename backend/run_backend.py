import uvicorn
import os

os.chdir(os.path.dirname(__file__))

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8001,
        reload=False
    )
