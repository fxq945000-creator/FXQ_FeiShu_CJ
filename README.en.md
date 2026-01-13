# Feishu Multi-dimensional Table Screenshot Plugin

## Project Introduction

This is a screenshot plugin specially designed for Feishu Multi-dimensional Tables, providing screenshot functions similar to WPS Tables and Windows systems. It supports full-screen screenshots, window screenshots, and area screenshots, and can directly insert screenshots into Feishu Multi-dimensional Table cells.

## Features

- **Full-screen Screenshot**: Quickly capture the entire screen content
- **Window Screenshot**: Precisely capture the current active window
- **Area Screenshot**: Freely select any area on the screen
- **Local Save**: Save screenshots to local files
- **Clipboard Copy**: Directly copy screenshots to the system clipboard
- **Undo Function**: Support undoing the last operation
- **Feishu Integration**: Can directly insert screenshots into Feishu Multi-dimensional Table cells
- **Responsive Design**: Adapt to different screen sizes and Feishu application environments

## Technical Architecture

- **Frontend Technology**: HTML5 + CSS3 + JavaScript
- **Core API**: Browser native screen capture API (`navigator.mediaDevices.getDisplayMedia`)
- **Feishu Integration**: Feishu Multi-dimensional Table API (`window.fsTable`)
- **Storage Technology**: Local file system + Feishu Multi-dimensional Table storage

## Project Structure

```
FXQ_FeiShu_CJ/
├── package.json          # Project configuration file
├── manifest.json         # Feishu plugin configuration file
├── index.html            # Plugin main interface
├── style.css             # Interface styles
├── index.js              # Core function logic
├── build.js              # Build script
├── icon.png              # Plugin icon
├── README.md             # Chinese documentation
├── README.en.md          # English documentation
├── README_Plugin.md      # Detailed plugin usage instructions
└── dist/                 # Build output directory
    ├── index.html
    ├── style.css
    ├── index.js
    ├── manifest.json
    ├── icon.png
    └── README_Plugin.md
```

## Installation

### 1. Download the Plugin

Download all files of this project to a local directory.

### 2. Create an Application on Feishu Developer Platform

1. Visit [Feishu Developer Platform](https://open.feishu.cn/)
2. Log in and create a new application
3. In the application settings, select "Multi-dimensional Table Plugin" type
4. Configure basic information and permissions for the application

### 3. Upload the Plugin

1. On the Feishu Developer Platform's application management page, find "Plugin Management"
2. Click "Upload Plugin Package", select all files in the project's dist directory (compressed into ZIP format)
3. After uploading, click the "Publish" button

### 4. Use in Feishu Multi-dimensional Table

1. Open Feishu Multi-dimensional Table
2. In the table interface, click the "Plugin" button in the upper right corner
3. Find and enable "Feishu Multi-dimensional Table Screenshot Plugin"
4. The plugin will add a "Screenshot" button to the toolbar

## Usage Instructions

### Screenshot Operations

1. Click the "Screenshot" button in the Feishu Multi-dimensional Table toolbar to open the screenshot tool
2. Select the screenshot type you need:
   - Click "Full-screen Screenshot" to capture the entire screen
   - Click "Window Screenshot" to capture the current active window
   - Click "Area Screenshot" to freely select the screenshot area
3. After taking a screenshot, you can:
   - Click "Save" to save the screenshot locally or insert it into the Feishu table
   - Click "Copy to Clipboard" to copy the screenshot directly to the system clipboard
   - Click "Undo" to undo the last operation
   - Click "Cancel" to close the screenshot tool

### Insert Screenshot into Feishu Table

1. First select a target cell in the Feishu Multi-dimensional Table
2. Open the screenshot tool and complete the screenshot
3. Click the "Save" button, a prompt box will appear asking whether to insert into the table
4. Click "OK", the screenshot will be automatically inserted into the selected cell

## Development and Build

### Development Environment

- Modern browser (Chrome, Edge, etc.)
- Feishu client

### Build the Project

```bash
# Generate dist directory and build output
npm run build
```

## Contribution Guide

1. Fork this repository
2. Create a Feat_xxx branch
3. Commit your code
4. Create a Pull Request

## License

This project adopts the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, please feel free to contact us:

- Feishu:
- Email:
