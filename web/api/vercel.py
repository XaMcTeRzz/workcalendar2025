from index import app

# Для Vercel Serverless Functions
def handler(request, context):
    return app 