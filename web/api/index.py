from flask import Flask, render_template, request, jsonify, redirect, url_for
import sys
import os
import json

# Додаємо батьківську директорію до шляху
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Імпортуємо додаток Flask з app.py
from app import app as flask_app

# Для Vercel Serverless Functions
def handler(request, context):
    return flask_app(request['headers']['host'], request['path'], request['httpMethod'], request['body'], request['queryStringParameters']) 