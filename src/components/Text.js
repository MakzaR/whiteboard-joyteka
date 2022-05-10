import Konva from "konva";
import {v4 as uuidv4} from 'uuid';

export const addTextNode = (stage, layer) => {
    const id = uuidv4();
    const textNode = new Konva.Text({
        text: 'Новый текст...',
        x: 100,
        y: 100,
        fontSize: 20,
        draggable: true,
        width: 100,
        id
    });

    layer.add(textNode);

    let transformer = new Konva.Transformer({
        node: textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        boundBoxFunc: function (oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
        }
    });

    stage.on('click', function (ev) {
        if (!this.clickStartShape) {
            return
        }
        if (ev.target._id === this.clickStartShape._id) {
            layer.add(transformer);
            transformer.nodes([ev.target]);
            layer.draw();
        } else {
            transformer.detach();
            layer.draw();
        }
    });

    textNode.on('transform', () => {
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1
        });
    });

    layer.add(transformer);
    layer.draw();

    textNode.on('dblclick', () => {
        textNode.hide();
        transformer.hide();
        layer.draw();

        let textPosition = textNode.absolutePosition();
        let stageBoundaries = stage.container().getBoundingClientRect();
        let textareaPosition = {
            x: stageBoundaries.left + textPosition.x,
            y: stageBoundaries.top + textPosition.y
        };

        let textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = textareaPosition.y + 'px';
        textarea.style.left = textareaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();

        let rotation = textNode.rotation();
        let transform = '';
        let px = 0;
        let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if (rotation) {
            transform += `rotateZ${rotation}deg`;
        }

        if (isFirefox) {
            px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += `translateY(-${px}px)`;

        textarea.style.transform = transform;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        const hideTextarea = () => {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            textNode.show();
            transformer.show();
            transformer.forceUpdate();
            layer.draw();
        }

        const handleOutsideClick = (ev) => {
            if (ev.target !== textarea) {
                hideTextarea();
            }
        }

        const setTextareaWidth = (newWidth) => {
            if (!newWidth) {
                newWidth = textNode.placeholder.length + textNode.fontSize();
            }
            let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            let isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
            let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth);
            }
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', (ev) => {
            if (ev.code === 'Enter' && !ev.shiftKey) {
                textNode.text(textarea.value);
                hideTextarea();
            }
            if (ev.code === 'Escape') {
                hideTextarea();
            }
        });

        textarea.addEventListener('keydown', (ev) => {
            let scale = textNode.getAbsoluteScale().x;
            setTextareaWidth(textNode.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    });

    return id;
}