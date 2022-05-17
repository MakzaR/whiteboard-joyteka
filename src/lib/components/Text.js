import Konva from "konva";
import {v4 as uuidv4} from 'uuid';

export const addTextNode = (stage, layer, transformer) => {
    const id = uuidv4();
    const textNode = new Konva.Text({
        text: 'Новый текст',
        x: stage.getRelativePointerPosition().x,
        y: stage.getRelativePointerPosition().y,
        fontSize: 20,
        draggable: true,
        width: 200,
        name: 'textNode',
        id
    });

    layer.add(textNode);

    stage.on('click', function (ev) {
        const clickedOnEmptyStage = ev.target === ev.target.getStage();
        const clickedOnEmptyBackground = ev.target.hasName('background');
        if (clickedOnEmptyStage || clickedOnEmptyBackground) {
            transformer.nodes([]);
            return;
        }
        if (!ev.target.hasName('textNode')) {
            return;
        }
        transformer.nodes([ev.target]);
    });

    textNode.on('transform', () => {
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1
        });
    });

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

export const deleteTextNode = (layer, currentShape, transformer) => {
    transformer.nodes([]);
    currentShape.destroy();
    layer.draw();
}
