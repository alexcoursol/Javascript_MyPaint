/*jslint browser this*/
/*global window, tools, pencil, FileReader*/

(function () {
    "use strict";
    var tools;
    var pencil;

    var rectangle = {
        x_origin: 0,
        y_origin: 0,
        first_line: true,
        draw: function () {
            tools.mypaint.context.beginPath();
            if (this.first_line === true) {
                this.x_origin = event.offsetX;
                this.y_origin = event.offsetY;
                this.first_line = false;
            } else {
                var width = event.offsetX - this.x_origin;
                var height = event.offsetY - this.y_origin;
                tools.mypaint.context.lineWidth = tools.thicknessValue;
                tools.mypaint.context.rect(this.x_origin, this.y_origin, width, height);
                tools.mypaint.context.strokeStyle = tools.colorValue;
                if (tools.filled === true) {
                    tools.mypaint.context.fillStyle = tools.colorValue;
                    tools.mypaint.context.fill();
                }
                tools.mypaint.context.stroke();
                this.first_line = true;
            }
        }
    };

    var line = {
        endLine: false,
        first_line: true,
        draw: function () {
            if (this.first_line === true) {
                var x = event.offsetX;
                var y = event.offsetY;
                tools.mypaint.context.beginPath();
                tools.mypaint.context.moveTo(x, y);
                this.first_line = false;
            } else {
                tools.mypaint.context.lineTo(event.offsetX, event.offsetY);
                tools.mypaint.context.lineWidth = tools.thicknessValue;
                tools.mypaint.context.strokeStyle = tools.colorValue;
                tools.mypaint.context.stroke();
                this.first_line = true;
            }
        }
    };

    pencil = {
        paint: true,
        x: 0,
        y: 0,
        first_point: true,
        handleMouseMove: function () {
            if (this.paint !== false) {
                tools.mypaint.context.beginPath();
                if (this.first_point === true) {
                    this.x = event.x - tools.mypaint.canvas.offsetLeft;
                    this.y = event.y - tools.mypaint.canvas.offsetTop;
                    this.first_point = false;
                }
                tools.mypaint.context.moveTo(this.x, this.y);
                tools.mypaint.context.lineTo(event.x - tools.mypaint.canvas.offsetLeft, event.y - tools.mypaint.canvas.offsetTop);
                this.x = event.x - tools.mypaint.canvas.offsetLeft;
                this.y = event.y - tools.mypaint.canvas.offsetTop;
                tools.mypaint.context.strokeStyle = tools.colorValue;
                tools.mypaint.context.lineWidth = tools.thicknessValue;
                tools.mypaint.context.lineJoin = 'round';
                tools.mypaint.context.lineCap = 'round';
                tools.mypaint.context.stroke();
                tools.mypaint.drawMiniLayer();
            }
        },
        draw: function () {
            if (tools.eraserValue === true) {
                tools.mypaint.context.globalCompositeOperation = 'destination-out';
            } else {
                tools.mypaint.context.globalCompositeOperation = 'source-over';
            }
            this.paint = true;
            tools.mypaint.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this, event));
        },
        endDraw: function () {
            tools.mypaint.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this, event));
            this.first_point = true;
            this.paint = false;
        }
    };

    var circle = {
        first_line: true,
        paint: true,
        x_origin: 0,
        y_origin: 0,
        draw: function () {
            tools.mypaint.context.beginPath();
            if (this.first_line === true) {
                this.x_origin = event.offsetX;
                this.y_origin = event.offsetY;
                this.first_line = false;
            } else {
                var t = (event.offsetX - this.x_origin) * (event.offsetX - this.x_origin) + (event.offsetY - this.y_origin) * (event.offsetY - this.y_origin);
                var width = Math.sqrt(t);
                tools.mypaint.context.lineWidth = tools.thicknessValue;
                tools.mypaint.context.arc(this.x_origin, this.y_origin, width, 0, 2 * Math.PI);
                tools.mypaint.context.strokeStyle = tools.colorValue;
                if (tools.filled === true) {
                    tools.mypaint.context.fillStyle = tools.colorValue;
                    tools.mypaint.context.fill();
                }
                tools.mypaint.context.stroke();
                this.first_line = true;
            }
        }
    };

    tools = {
        mypaint: null,
        currentTool: '',
        thicknessValue: 5,
        colorValue: '#000000',
        filled: false,
        eraserValue: false,
        pencil: {
            init: function () {
                tools.eraserValue = false;
                tools.currentTool = 'pencil';
                tools.mypaint.canvas.style.cursor = 'url(images/pencil.png), default';
            }
        },
        line: {
            init: function () {
                tools.mypaint.context.globalCompositeOperation = 'source-over';
                tools.currentTool = 'line';
                tools.mypaint.canvas.style.cursor = 'crosshair';
            }
        },
        rectangle: {
            init: function () {
                tools.mypaint.context.globalCompositeOperation = 'source-over';
                tools.currentTool = 'rectangle';
                tools.mypaint.canvas.style.cursor = 'crosshair';
            }
        },
        circle: {
            init: function () {
                tools.mypaint.context.globalCompositeOperation = 'source-over';
                tools.currentTool = 'circle';
                tools.mypaint.canvas.style.cursor = 'crosshair';
            }
        },
        symetry: {
            init: function () {
                tools.mypaint.context.rotate(-Math.PI / 10);
            }
        },
        eraser: {
            init: function () {
                tools.currentTool = 'pencil';
                tools.eraserValue = true;
                tools.mypaint.canvas.style.cursor = "url(images/eraser_canvas.png), default";
            }
        },
        color: {
            init: function () {
                tools.colorValue = tools.mypaint.colorButton.value;
            }
        },
        rgbBox: {
            init: function () {
                tools.colorValue = 'rgb(' + this.mypaint.rgbs[0].value + ', ' + this.mypaint.rgbs[1].value + ', ' + this.mypaint.rgbs[2].value + ')';
            }
        },
        hslBox: {
            init: function () {
                tools.colorValue = 'hsl(' + this.mypaint.hsls[0].value + ', ' + this.mypaint.hsls[1].value + '%, ' + this.mypaint.hsls[2].value + '%)';
            }
        },
        thickness: {
            init: function () {
                tools.thicknessValue = tools.mypaint.thicknessButton.value;
            }
        },
        fill: {
            init: function () {
                if (tools.filled === true) {
                    tools.filled = false;
                } else {
                    tools.filled = true;
                }
            }
        },
        setMyPaint: function (mypaint) {
            this.mypaint = mypaint;
        },
        setContext: function (context) {
            this.mypaint.context = context;
        },
        setCanvas: function (canvas) {
            this.mypaint.canvas = canvas;
        }
    };
    var layerTool = {
        mypaint: null,
        nbLayers: 1,
        currentLayer: 1,
        currentCanvas: 1,
        zindex: 1,
        setMyPaint: function (mypaint) {
            this.mypaint = mypaint;
        },
        changeCurrentLayer: function (currLay) {
            document.getElementById('layer' + this.currentLayer).style.border = '2px solid #000000';

            tools.mypaint.context.clearRect(0, 0, this.mypaint.canvas.width, this.mypaint.canvas.height);
            this.currentLayer = currLay.substring(5);
            if (currLay === 'layer' + this.nbLayers) {
                var i = 1;
                while (i <= this.nbLayers) {
                    tools.mypaint.context.drawImage(document.getElementById('layer' + i), 0, 0, 1000, 700);
                    i += 1;
                }
            } else {
                tools.mypaint.context.drawImage(document.getElementById('layer' + this.currentLayer), 0, 0, 1000, 700);
            }
            document.getElementById('layer' + this.currentLayer).style.border = "5px solid #000000";
        },
        addLayer: function () {
            this.nbLayers += 1;
            this.zindex -= 1;

            var newCanvas = document.createElement('canvas');
            newCanvas.id = 'canvaslayer' + this.nbLayers;
            newCanvas.width = "1000";
            newCanvas.height = '700';
            newCanvas.style.position = 'absolute';
            newCanvas.style.zIndex = this.zindex;
            this.mypaint.canvasBox.appendChild(newCanvas);
            var newContext = newCanvas.getContext('2d');
            this.currentCanvas = this.nbLayers;
            newContext.drawImage(this.mypaint.canvas, 0, 0, 1000, 700);

            document.getElementById('layer' + this.currentLayer).style.border = '2px solid #000000';
            var lay = document.createElement('canvas');
            lay.id = 'layer' + this.nbLayers;
            lay.className = 'layer';
            lay.width = "1000";
            lay.height = '700';
            this.mypaint.layersBox.appendChild(lay);
            this.currentLayer = this.nbLayers;
            lay.addEventListener('click', this.changeCurrentLayer.bind(this, lay.id));
            document.getElementById('layer' + this.currentLayer).style.border = "5px solid #000000";
        }
    };

    var myPaint = {
        canvasBox: null,
        canvas: null,
        context: null,
        nb_tools: 0,
        host: '',
        directory: '',
        thicknessButton: null,
        colorButton: null,
        fillButton: null,
        toolButtons: null,
        saveButton: null,
        openButton: null,
        layerButton: null,
        layersBox: null,
        layer1: null,
        rgbBox: null,
        rgbs: null,
        hslBox: null,
        hsls: null,
        init: function () {
            this.host = window.location.hostname;
            this.directory = window.location.pathname;
            this.canvasBox = document.getElementById('canvases');
            this.nb_tools = document.getElementsByClassName('tools').length;
            this.canvas = document.getElementById('canvaslayer1');
            this.thicknessButton = document.getElementById('thickness');
            this.colorButton = document.getElementById('color');
            this.fillButton = document.getElementById('fill');
            this.saveButton = document.getElementById('save2');
            this.openButton = document.getElementById('image');
            this.toolButtons = document.getElementsByClassName('tools');
            this.layerButton = document.getElementById('layerTool');
            this.layersBox = document.getElementById('layers');
            this.layer1 = document.getElementById('layer1');
            this.context = this.canvas.getContext("2d");
            tools.setMyPaint(this);
            this.rgbBox = document.getElementById('rgbBox');
            this.rgbs = document.getElementsByClassName('rgb');
            this.hslBox = document.getElementById('hslBox');
            this.hsls = document.getElementsByClassName('hsl');
            layerTool.setMyPaint(this);
            this.addListeners();
        },
        addListeners: function () {
            var value;
            var i = 0;
            tools.mypaint.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.canvas.addEventListener('mouseup', pencil.endDraw.bind(pencil));
            this.thicknessButton.addEventListener('change', tools[this.thicknessButton.id].init.bind(tools));
            this.colorButton.addEventListener('change', tools[this.colorButton.id].init.bind(tools));
            while (i < this.nb_tools) {
                value = this.toolButtons[i].id;
                this.toolButtons[i].addEventListener('click', tools[value].init);
                i += 1;
            }
            this.fillButton.addEventListener('click', this.changeFill.bind(this));
            this.saveButton.addEventListener('click', this.saveDrawing.bind(this));
            this.openButton.addEventListener('change', this.openDrawing.bind(this));
            this.layerButton.addEventListener('click', layerTool.addLayer.bind(layerTool));
            this.layer1.addEventListener('click', layerTool.changeCurrentLayer.bind(layerTool, this.layer1.id));
            this.rgbBox.addEventListener('click', tools.rgbBox.init.bind(tools));
            this.hslBox.addEventListener('click', tools.hslBox.init.bind(tools));
        },
        changeFill: function () {
            if (tools.filled === true) {
                this.fillButton.style.backgroundColor = '#000000';
            } else {
                this.fillButton.style.backgroundColor = '';
            }
        },
        openDrawing: function () {
            var self = this;
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    img.width = self.canvas.width;
                    img.height = self.canvas.height;
                    img.style.width = self.canvas.width;
                    img.style.height = self.canvas.height;
                    tools.mypaint.context.drawImage(img, 0, 0);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(tools.mypaint.openButton.files[0]);
        },
        saveDrawing: function () {
            this.saveButton.href = this.canvas.toDataURL();
        },
        handleMouseDown: function () {
            switch (tools.currentTool) {
            case "circle":
                circle.draw();
                break;
            case "pencil":
                pencil.draw();
                break;
            case "line":
                line.draw();
                break;
            case "rectangle":
                rectangle.draw();
                break;
            case "eraser":
                break;
            }
            if (tools.currentTool !== 'pencil') {
                this.drawMiniLayer();
            }
        },
        drawMiniLayer: function () {

            var currLayerHTML = document.getElementById('layer' + layerTool.currentLayer);
            var destCtxt = currLayerHTML.getContext('2d');
            destCtxt.drawImage(tools.mypaint.canvas, 0, 0, 1000, 700);
        },
        setCanvas: function (canvas) {
            this.canvas = canvas;
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        myPaint.init();
    });
}());