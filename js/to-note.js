document.addEventListener('DOMContentLoaded', () => {
    const diary = document.querySelector('.diary');
    const cover = document.querySelector('.cover');
    const back_cover = document.querySelector('.back-cover');
    const pages = document.querySelector('.page');
    const leftPage = document.getElementById('left');
    const rightPage = document.getElementById('right');

    cover.style.height = '1110px'
    cover.style.width = '1000px'
    back_cover.style.height = '1100px'
    back_cover.style.width = '1000px'
    leftPage.style.height = '1080px'
    leftPage.style.width = '990px'
    rightPage.style.height = '1080px'
    rightPage.style.width = '990px'

    if (!sessionStorage.getItem('keep-open')) {
        sessionStorage.setItem('keep-open', 'true')
        for (let i = 1; i <= 5; i++) {
            const page = document.createElement('div')
            page.classList.add('page')
            diary.appendChild(page)

            page.offsetHeight

            page.classList.add('flip')
            page.style.transitionDuration = `${0.7 * i}s`
        }
    
        setTimeout(() => {
        const pages = document.querySelectorAll('.page')
            for (let i = 0; i < 7; i++) {
                if (pages[i] && !pages[i].id) {
                    diary.removeChild(pages[i])
                }
            }

            const lp = document.getElementById('left')

            lp.classList.add('flip')
            lp.classList.remove('flip')
            lp.style.right = '0'
            lp.style.borderRadius = '10px 2px 2px 10px'
        }, 3000)
    } else {
        const lp = document.getElementById('left')

        lp.classList.add('flip')
        lp.classList.remove('flip')
        lp.style.right = '0'
        lp.style.borderRadius = '10px 2px 2px 10px'
    }

    let scale = 1;
    let isD = false;
    let startX, startY;
    let isSp = false;
    let isMd = false;
    let isDrawingMode = false;

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            isSp = true;
            if (isMd) {
                isD = true;
                //diary.style.cursor = 'grabbing';
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            isSp = false;
            isD = false;
            //diary.style.cursor = 'grab';
        }
    });

    diary.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(.125, scale), 4);
        diary.style.transform = `scale(${scale})`;
    });

    diary.addEventListener('mousedown', (e) => {
        isMd = true;
        startX = e.clientX - diary.offsetLeft;
        startY = e.clientY - diary.offsetTop;

        if (isSp) {
            isD = true;
            //diary.style.cursor = 'grabbing';
        }
    });

    diary.addEventListener('mousemove', (e) => {
        if (isD) {
            diary.style.left = `${e.clientX - startX}px`;
            diary.style.top = `${e.clientY - startY}px`;
        }
    });

    diary.addEventListener('mouseup', () => {
        isMd = false;
        isD = false;
        //diary.style.cursor = 'grab';
    });

    diary.addEventListener('mouseleave', () => {
        isMd = false;
        isD = false;
        //diary.style.cursor = 'grab';
    });

    const leftCanvas = new fabric.Canvas('canvas-left');
    const rightCanvas = new fabric.Canvas('canvas-right');

    let activeCanvas = leftCanvas;
    let mousePos = { x: 0, y: 0 };

    /* Gerador de ID para cada objeto canvas */

    const generateUniqueId = () => {
        return 'object_' + Math.random().toString(36).substr(2, 9);
    }

    /* */

    // sessão relacionado a textos e desenhos

    const createX = (canvas) => {
        if (!mousePos) return;
    
        const xSize = 50;
        const halfSize = xSize / 2;
    
        const x1 = mousePos.x - halfSize;
        const y1 = mousePos.y - halfSize;
        const x2 = mousePos.x + halfSize;
        const y2 = mousePos.y + halfSize;
        const x3 = mousePos.x + halfSize;
        const y3 = mousePos.y - halfSize;
        const x4 = mousePos.x - halfSize;
        const y4 = mousePos.y + halfSize;
    
        const line1 = new fabric.Line([x1, y1, x2, y2], {
            stroke: 'red',
            strokeWidth: 2,
            selectable: true,
            id: generateUniqueId(),
        });
    
        const line2 = new fabric.Line([x3, y3, x4, y4], {
            stroke: 'red',
            strokeWidth: 2,
            selectable: true,
            id: generateUniqueId(),
        });
    
        canvas.add(line1, line2);
    
        const group = new fabric.Group([line1, line2], {
            left: mousePos.x - halfSize,
            top: mousePos.y - halfSize,
            selectable: true,
            id: generateUniqueId(),
        });
    
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
    };

    const createSquare = (canvas) => {
        if (!mousePos) return;
    
        const squareSize = 50; 
        const square = new fabric.Rect({
            left: mousePos.x - squareSize / 2,
            top: mousePos.y - squareSize / 2, 
            width: squareSize,
            height: squareSize,
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: 'black',
            strokeWidth: 2,
            selectable: true,
            id: generateUniqueId(),
        });
    
        canvas.add(square);
        canvas.setActiveObject(square);
        canvas.renderAll();
    };    

    const createTextBox = (canvas, left, top) => {
        const textBox = new fabric.IText('Escreva algo aqui...', {
            left: left || canvas.width / 2,
            top: top || canvas.height / 2,
            fontFamily: 'Caveat',
            fontSize: 25,
            fill: 'black',
            editable: true,
            id: generateUniqueId()
        });
        canvas.add(textBox);
        canvas.setActiveObject(textBox);
        canvas.renderAll();
    }

    const activeDrawing = (canvas) => {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode

        if (isDrawingMode) {
            canvas.freeDrawingBrush.color = 'black';
            canvas.freeDrawingBrush.width = 5;

            canvas.upperCanvasEl.style.cursor = 'crosshair';

            console.log("Drawing");
        } else {
            canvas.upperCanvasEl.style.cursor = 'default';

            console.log("Not Drawing");
        }
    }

    const activeMarkingWithoutKeyWord = (canvas) => {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;

        if (isDrawingMode) {
            canvas.freeDrawingBrush.color = 'rgba(255, 255, 0, 0.4)';
            canvas.freeDrawingBrush.width = 15;

            canvas.upperCanvasEl.style.cursor = 'crosshair';

            console.log("Marking Text without keyword");
        } else {
            canvas.upperCanvasEl.style.cursor = 'default';
            console.log("Not Marking Text without keyword");
        }
    };

    const activeMarking = (canvas) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        const activeObject = canvas.getActiveObject();
    
        if (activeObject && activeObject.type === 'i-text') {
            const color = "#78FFFF"; // Cor padrão para marcação
            const keyWord = activeObject.text.trim(); // Capturar o texto marcado
    
            if (color && keyWord) {
                activeObject.set('textBackgroundColor', color);
                canvas.renderAll();
    
                fetch(`ajax/render_pages.php?current_page=true&book=${book}`)
                .then(res=>res.json())
                .then(data=>{
                    if (data.status == 'success') {
                        saveMarkCanvasObject(keyWord, data.left, data.right, 'addOrUpdate');
                    } else {
                        console.log('Failed')
                    }
                });
                console.log(`Marked text: ${keyWord}`);
            } else {
                console.log("No text or color provided.");
            }
        } else {
            console.log("No text box selected.");
            alert("Please select a text box to mark.");
        }
    };

    const setupCanvasMouseDec = (canvas) => {
        canvas.on('mouse:move', (event) => {
            activeCanvas = canvas;
            const pointer = canvas.getPointer(event.e);
            mousePos = { x: pointer.x, y: pointer.y };
        });
    };

    setupCanvasMouseDec(leftCanvas);
    setupCanvasMouseDec(rightCanvas);

    // document.addEventListener('keydown', (e) => {
    //     console.log(e.code);
    // });

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'KeyT') {
            if (isFlipping) return;

            createTextBox(activeCanvas, mousePos.x, mousePos.y);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'BracketLeft') {
            if (isFlipping) return;

            activeDrawing(activeCanvas);
        }
    })

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'Quote') {
            if (isFlipping) return;
    
            activeMarking(activeCanvas);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'IntlRo') {
            if (isFlipping) return;
    
            activeMarkingWithoutKeyWord(activeCanvas);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'BracketRight') {
            if (isFlipping) return;

            createSquare(activeCanvas);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (isSp && e.code === 'Backslash') {
            if (isFlipping) return;

            createX(activeCanvas);
        }
    });

    /* **** */

    // sessão imagens

    fabric.Object.prototype.transparentCorners = false;

    const PolaroidPhoto = fabric.util.createClass(fabric.Image, {
        H_PADDING: 30,
        V_PADDING: 50,
        originX: 'center',
        originY: 'center',
        initialize: function(src, options) {
            options = options || {};
            options.src = src;
            options.id = generateUniqueId();
    
            this.callSuper('initialize', src, options);
    
            this.image = new Image();
            this.image.src = src;
            this.image.onload = (function() {
                this.width = this.image.width;
                this.height = this.image.height;
                this.loaded = true;
    
                const targetWidth = 600;
                const targetHeight = 400;
                const scaleX = targetWidth / this.width;
                const scaleY = targetHeight / this.height;
                const scale = Math.min(scaleX, scaleY);
    
                this.width *= scale;
                this.height *= scale;
    
                this.setCoords();
                this.fire('image:loaded'); // Dispara o evento quando a imagem carregar
            }).bind(this);
        },
        _render: function(ctx) {
            if (this.loaded) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(
                    -(this.width / 2) - this.H_PADDING,
                    -(this.height / 2) - this.H_PADDING,
                    this.width + this.H_PADDING * 2,
                    this.height + this.V_PADDING * 2
                );
                ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            }
        }
    });

    let isFlipping = false;

    const setupDragAndDrop = (canvas) => {
        canvas.wrapperEl.addEventListener('dragover', (e) => {
            if (isFlipping) return;

            e.preventDefault();
        });

        canvas.wrapperEl.addEventListener('drop', (e) => {
            if (isFlipping) return;

            e.preventDefault();

            const pointer = canvas.getPointer(e);
            const mouseX = pointer.x;
            const mouseY = pointer.y;

        
            const items = e.dataTransfer.items;
            if (items && items.length > 0) {
                const item = items[0].getAsFile();
                if (item && item.type.startsWith('image/')) {
                    const formData = new FormData();
                    formData.append('file', item);

                    fetch('ajax/upload_manager.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res=>res.json())
                    .then(data=>{
                        if (data.status == 'success') {
                            const imagePath = data.filePath;
                            console.log(data.filePath)

                            const photo = new PolaroidPhoto(imagePath, {
                                H_PADDING: 30,
                                V_PADDING: 50,
                                top: mouseY,
                                left: mouseX,
                                scaleX: 0.5,
                                scaleY: 0.5
                            });

                            console.log('photo: '+photo)
    
                            photo.on('image:loaded', canvas.renderAll.bind(canvas));
                            photo.drawBorders = photo.drawCorners = function() { return this };
                            canvas.add(photo);
                        } else {
                            console.error('Erro ao enviar a imagem: ', data.message);
                        }
                    })
                }
            }
        });
    };

    setupDragAndDrop(leftCanvas);
    setupDragAndDrop(rightCanvas);

    /* deletar algum conteudo canvas */

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Delete' || e.key === 'Delete') {
            if (isFlipping) return;

            const activeObject = activeCanvas.getActiveObject();

            if (activeObject) {
                activeCanvas.remove(activeObject);
                activeCanvas.renderAll();
                // alert('success', 'Deletado com sucesso!')
            }
        }
    })

    /* sistema salvar conteudo e carregar */

    /* salvar página */

    const saveCanvasObject = (object, page, action) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        const content = JSON.stringify(object.toObject(['src', 'id']));

        fetch('ajax/render_pages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'save_canvas',
                page: page,
                object: content,
                action: action,
                book: book
            })
        })
        .then(res => res.text())
        .then(text => {
            //console.log('Resposta do servidor: ', text);
            try {
                const data = JSON.parse(text);
                if (data.status == 'success') {
                    console.log('Página salva com sucesso!');
                } else {
                    console.log('Erro: '+data.message);
                }
            } catch (error) {
                console.error('Erro ao analisar o JSON:', text);
            }
        })
    };

    let isClearingCanvas = false;
    let isLoadingPage = false;

    // const loadCanvasContent = (canvas, page) => {
    //     fetch(`ajax/render_pages.php?load&page=${page}`)
    //     .then(res=>res.json())
    //     .then(data=>{
    //         isLoadingPage = true;
    //         if (data.status == 'success' && data.content) {
    //             //canvas.loadFromJSON(data.content, canvas.renderAll.bind(canvas));
    //             console.log("Conteúdo recebido:", data.content);

    //             const pageContent = data.content.objects;

    //             if (pageContent) {
    //                 const validObjects = Object.values(pageContent).filter(object => object !== null);

    //                 canvas.loadFromJSON({objects: validObjects}, () => {
    //                     const imagePromises = [];
    
    //                     canvas.getObjects().forEach(object => {
    //                         if (object.type === 'image') {
    //                             const imgElement = new Image();
    //                             imgElement.src = object._element.src;
    
    //                             const imageLoadPromise = new Promise((resolve) => {
    //                                 imgElement.onload = () => {
    //                                     object.loaded = true;
    //                                     object.image = imgElement;
    //                                     object.setCoords();
    //                                     canvas.renderAll();
    //                                     resolve();
    //                                 }
    //                             });
    
    //                             imagePromises.push(imageLoadPromise);
    
    //                             object.H_PADDING = PolaroidPhoto.prototype.H_PADDING; // Define H_PADDING
    //                             object.V_PADDING = PolaroidPhoto.prototype.V_PADDING; // Define V_PADDING
        
    //                             object._render = PolaroidPhoto.prototype._render;
    //                         }
    //                     });
    
    //                     if (imagePromises.length > 0) {
    //                         Promise.all(imagePromises).then(() => {
    //                             console.log(imagePromises);
    //                             isLoadingPage = false;
    //                             console.log('Canvas carregou com todas as imagens.');
    //                         });
    //                     } else {
    //                         isLoadingPage = false;
    //                         console.log('Canvas carregou sem imagens.');
    //                     }
    //                 });
    //             }

    //             console.log('Estado do canvas carregado com sucesso!');
    //         } else {
    //             console.log('Erro ao carregar o conteúdo ou está vazio | message: ' + data.message);
    //             isLoadingPage = false;
    //         }
    //     });
    // };

    const loadCanvasContent = (canvas, page) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');

        fetch(`ajax/render_pages.php?load&page=${page}&book=${book}`)
        .then(res=>res.json())
        .then(data=>{
            isLoadingPage = true;
            if (data.status == 'success' && data.content) {
                //canvas.loadFromJSON(data.content, canvas.renderAll.bind(canvas));
                console.log("Conteúdo recebido:", data.content);

                const pageContent = data.content.objects;
                const keyWords = data.key_words;
                console.log("Keywords: " + keyWords)

                if (pageContent) {
                    const validObjects = Object.values(pageContent).filter(object => object !== null);

                    canvas.loadFromJSON({objects: validObjects}, () => {
                        const imagePromises = [];

                        canvas.getObjects().forEach(object => {
                            if (object.type === 'i-text' && keyWords.includes(object.text)) {
                                object.set('textBackgroundColor', '#78FFFF');
                                canvas.renderAll();
                            }
                        });
    
                        canvas.getObjects().forEach(object => {
                            if (object.type === 'image') {
                                const imgElement = new Image();
                                imgElement.src = object._element.src;
    
                                const imageLoadPromise = new Promise((resolve) => {
                                    imgElement.onload = () => {
                                        object.loaded = true;
                                        object.image = imgElement;
                                        object.setCoords();
                                        canvas.renderAll();
                                        resolve();
                                    }
                                });
    
                                imagePromises.push(imageLoadPromise);
    
                                object.H_PADDING = PolaroidPhoto.prototype.H_PADDING; // Define H_PADDING
                                object.V_PADDING = PolaroidPhoto.prototype.V_PADDING; // Define V_PADDING
        
                                object._render = PolaroidPhoto.prototype._render;
                            }
                        });
    
                        if (imagePromises.length > 0) {
                            Promise.all(imagePromises).then(() => {
                                console.log(imagePromises);
                                isLoadingPage = false;
                                console.log('Canvas carregou com todas as imagens.');
                            });
                        } else {
                            isLoadingPage = false;
                            console.log('Canvas carregou sem imagens.');
                        }
                    });
                }

                console.log('Estado do canvas carregado com sucesso!');
            } else {
                console.log('Erro ao carregar o conteúdo ou está vazio | message: ' + data.message);
                isLoadingPage = false;
            }
        });
    };

    /* *** */

    /* Sistema troca de páginas */

    const flipPageAnim = (direction) => {
        const diary = document.querySelector('.diary')

        if (direction === 'next') {
            const page = document.createElement('div')
            page.classList.add('page')
            page.style.height = '1080px'
            page.style.width = '990px'
            diary.appendChild(page)

            page.offsetHeight

            page.classList.add('flip')
            page.style.transitionDuration = `2.0s`
            setTimeout(() => {
                diary.removeChild(page)
                isFlipping = false;
            }, 2000)
        } else if (direction === 'prev') {
            const page = document.createElement('div')
            page.classList.add('page')
            page.style.height = '1080px'
            page.style.width = '990px'
            diary.appendChild(page)
            page.classList.add('flip');
        
            page.offsetHeight

            page.classList.add('return-flip');
            page.style.transitionDuration = `2.0s`
            setTimeout(() => {
                diary.removeChild(page)
                isFlipping = false;
            }, 2000)
        }
    };

    document.addEventListener('keydown', (event) => {
        if (isFlipping) return;

        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');

        if (event.key === 'ArrowRight') {
            isLoadingPage = true;
            fetch(`ajax/render_pages.php?right=true&book=${book}`)
            .then(res=>res.json())
            .then(data=>{
                if (data.status == 'success') {
                    isFlipping = true;

                    isClearingCanvas = true;
                    leftCanvas.clear();
                    rightCanvas.clear();
                    isClearingCanvas = false;

                    document.querySelector('.number-page.left').innerText = data.left + '.';
                    document.querySelector('.number-page.right').innerText = data.right + '.';
    
                    if (data.left_content) {
                        loadCanvasContent(leftCanvas, data.left);
                    }
    
                    if (data.right_content) {
                        loadCanvasContent(rightCanvas, data.right);
                    }

                    loadSources(data.left, data.right)
                    flipPageAnim('next');
                } else {
                    console.log('nao funcionou (next)')
                    isFlipping = false;
                }
                isLoadingPage = false;
            });
        } else if (event.key === 'ArrowLeft') {
            isLoadingPage = true;
            fetch(`ajax/render_pages.php?left=true&book=${book}`)
            .then(res=>res.json())
            .then(data=>{
                if (data.status == 'success') {
                    isFlipping = true;
                    
                    isClearingCanvas = true;
                    leftCanvas.clear();
                    rightCanvas.clear();
                    isClearingCanvas = false;

                    document.querySelector('.number-page.left').innerText = data.left + '.';
                    document.querySelector('.number-page.right').innerText = data.right + '.';

                    if (data.left_content) {
                        loadCanvasContent(leftCanvas, data.left);
                    }
    
                    if (data.right_content) {
                        loadCanvasContent(rightCanvas, data.right);
                    }

                    loadSources(data.left, data.right)
                    flipPageAnim('prev');
                } else {
                    console.log('nao funcionou (prev)')
                    isFlipping = false;
                }
                isLoadingPage = false;
            });
        }
    });

    window.addEventListener('load', (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        
        fetch(`ajax/render_pages.php?current_page=true&book=${book}`)
        .then(res=>res.json())
        .then(data=>{
            isLoadingPage = true;
            if (data.status == 'success') {
                console.log(data.left, data.right)
                loadCanvasContent(leftCanvas, data.left);
                loadCanvasContent(rightCanvas, data.right);

                loadSources(data.left, data.right);
            } else {
                console.log('nao funcionou (next)')
            }
            isLoadingPage = false;
        });
    });

    [leftCanvas, rightCanvas].forEach((canvas, index) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        const page = index === 0 ? 'left' : 'right';

        canvas.on('object:added', (event) => {
            if (!isLoadingPage) {
                const addedObject = event.target;
                if (!addedObject.id) {
                    addedObject.id = generateUniqueId();
                }
                saveCanvasObject(addedObject, page, 'addOrUpdate');
            }
        });

        canvas.on('object:modified', (event) => {
            if (!isLoadingPage) {
                const modifiedObject = event.target;
                saveCanvasObject(modifiedObject, page, 'addOrUpdate');
            }   
        });

        canvas.on('object:removed', (event) => {
            if (!isClearingCanvas && !isLoadingPage) {
                const removedObject = event.target;

                if (removedObject.type === 'image') {
                    const imagePath = removedObject.src;

                    fetch('ajax/remove_image.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ imagePath })
                    })
                    .then(res=>res.json())
                    .then(data=>{
                        if (data.status == 'success') {
                            console.log('Imagem removida com sucesso: ', data.message);
                        } else {
                            console.error('Erro ao remover a imagem: ', data.message);
                        }
                    });
                }

                saveCanvasObject(removedObject, page, 'remove');
                if (removedObject.type === 'i-text') {
                    fetch(`ajax/render_pages.php?current_page=true&book=${book}`)
                    .then(res=>res.json())
                    .then(data=>{
                        if (data.status == 'success') {
                            saveMarkCanvasObject(removedObject.text, data.left, data.right, 'remove');
                        } else {
                            console.log('Failed')
                        }
                    });
                }
            }
        });
    });

    /* *** */

    /* Tools */

    /* change page to browse number or key-words */

    document.getElementById('change-type-search').addEventListener('click', (e) => {
        e.preventDefault();
    
        const container = document.querySelector('.box-search');
        const currentInput = document.getElementById('search-input-number');
        const currentButton = document.getElementById('search-button-page-number');
    
        const existingKwInput = document.getElementById('search-key-word');
        const existingKwButton = document.getElementById('search-button-key-word');
    
        if (!existingKwInput && !existingKwButton) {
            // Criar novos elementos para busca por palavra-chave
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.id = 'search-key-word';
            newInput.placeholder = 'Browse key word';
            newInput.className = currentInput.className;
    
            const newButton = document.createElement('button');
            newButton.id = 'search-button-key-word';
            newButton.className = currentButton.className;
            newButton.innerHTML = '<i class="fa fa-search"></i>';
    
            container.replaceChild(newInput, currentInput);
            container.replaceChild(newButton, currentButton);
        } else {
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.id = 'search-input-number';
            newInput.placeholder = 'Browse page number';
            newInput.className = existingKwInput.className;
    
            const newButton = document.createElement('button');
            newButton.id = 'search-button-page-number';
            newButton.className = existingKwButton.className;
            newButton.innerHTML = '<i class="fa fa-search"></i>';
    
            container.replaceChild(newInput, existingKwInput);
            container.replaceChild(newButton, existingKwButton);
        }
    });

    /* search page number | search key word */

    document.querySelector('.box-search').addEventListener('click', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');

        if (e.target.id === 'search-button-page-number') {
            e.preventDefault();
            let input = document.getElementById('search-input-number').value.trim();
            input = input.replace(/\s+/g, '');
            const isNumber = /^\d+$/.test(input);
        
            if (input === '') {
                alert('Enter a search term.');
                return;
            }
        
            if (!isNumber) {
                document.getElementById('search-input-number').value = '';
                alert('Only numbers are allowed.');
                return;
            }
        
            fetch(`ajax/render_pages.php?book=${book}&searchPage=${input}`)
            .then(res=>res.json())
            .then(data=>{
                if (data.status == 'success') {
                    document.getElementById('search-input-number').value = '';
        
                    isFlipping = true;
        
                    isClearingCanvas = true;
                    leftCanvas.clear();
                    rightCanvas.clear();
                    isClearingCanvas = false;
        
                    document.querySelector('.number-page.left').innerText = data.left + '.';
                    document.querySelector('.number-page.right').innerText = data.right + '.';
        
                    if (data.left_content) {
                        loadCanvasContent(leftCanvas, data.left);
                    }
        
                    if (data.right_content) {
                        loadCanvasContent(rightCanvas, data.right);
                    }
        
                    isFlipping = false;
        
                    loadSources(data.left, data.right)
                    // flipPageAnim('next');
                } else if (data.status == 'failure') {
                    document.getElementById('search-input-number').value = '';
                    alert(data.message)
                    isFlipping = false;
                }
                isLoadingPage = false;
            });
        } else if (e.target.id === 'search-button-key-word') {
            e.preventDefault();
            alert('aaaaaa');
        }
    })

    const saveMarkCanvasObject = (keyWord, pageLeft, pageRight, action) => {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        const pageKey = `${pageLeft}-${pageRight}`;

        // Enviar o texto marcado e a página para o servidor
        fetch('ajax/render_pages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'save_mark',
                page: pageKey,
                keyWord: keyWord,
                action: action,
                book: book
            }),
        })
        .then(res=>res.json())
        .then(data => {
            if (data.status == 'success') {
                if (data.status === 'success') {
                    console.log(`Mark saved successfully: ${keyWord}`);
                } else {
                    console.error('Failed to save mark:', data.page, data.keyWord, data.action);
                }
            } else {
                console.log(data.message);
            }
        })
    };

    /* delete */

    document.getElementById('del-el').addEventListener('click', (e) => {
        e.preventDefault();

        alert('aaaaaaa')
        //if (isFlipping) return;
    
        const activeObject = activeCanvas.getActiveObject();
    
        if (activeObject) {
            activeCanvas.remove(activeCanvas);
            activeCanvas.renderAll();
            alert('success', 'Deleted with success!')
        }
    });

    /* sources */

    const pagesNumber = document.querySelector('.box-links .title h2');
    const linksContainer = document.querySelector('.links-container');
    const addSourceBtn = document.getElementById('add-source');
    const sourcesCount = document.querySelector('.plus-link h2');

    addSourceBtn.addEventListener('click', () => {
        const existingLinks = linksContainer.querySelectorAll('.links').length;
        // Mudar dps (provavelmente)
        if (existingLinks >= 4) {
            alert('You have reached the max number of links!');
            return;
        }
    
        const newLinkDiv = document.createElement('div');
        newLinkDiv.classList.add('links');
        newLinkDiv.innerHTML = `
            <input type="text" class="link-name" placeholder="Nome do link">
            <input type="url" class="link-url" placeholder="URL do link">
            <div class="actions">
                <button class="save"><i class="fa fa-check" aria-hidden="true"></i></button>
                <button class="cancel"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
        `;
    
        linksContainer.appendChild(newLinkDiv);
    
        const saveBtn = newLinkDiv.querySelector('.save');
        const cancelBtn = newLinkDiv.querySelector('.cancel');
    
        saveBtn.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const book = urlParams.get('book');

            const linkName = newLinkDiv.querySelector('.link-name').value.trim();
            const linkUrl = newLinkDiv.querySelector('.link-url').value.trim();
    
            if (!linkName || !linkUrl) {
                alert('Fill all the fields!');
                return;
            }

            fetch(`ajax/render_pages.php?current_page=true&book=${book}`)
            .then(res=>res.json())
            .then(data=>{
            if (data.status == 'success') {
                const pageNumber = `${data.left}-${data.right}`;
                //TODO: mudar sistema para pegar diretamente do mysql os links ao invés do html
                const existingLinks = Array.from(linksContainer.querySelectorAll('.links')).filter(link => {
                    return !link.querySelector('input.link-name') && !link.querySelector('input.link-url') &&
                    !link.querySelector('div.actions') && !link.querySelector('button.save') &&
                    !link.querySelector('button.cancel')
                })
                const linkId = `link${existingLinks.length + 1}`;

                const newLink = {
                    id: linkId,
                    title: linkName,
                    url: linkUrl
                };

                fetch('ajax/render_pages.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        type: 'save_source',
                        page: pageNumber,
                        object: newLink,
                        action: 'addOrUpdate',
                        book: book
                    })
                })
                .then(res=>res.json())
                .then(data => {
                    if (data.status == 'success') {
                        newLinkDiv.innerHTML = `
                            <a target="_blank" href="${linkUrl}">${linkName}</a>
                            <i class="fa fa-pencil edit" aria-hidden="true"></i>
                            <i id="del-source" class="fa fa-times remove" aria-hidden="true"></i>
                        `;
                        sourcesCount.textContent = `Sources: ${linksContainer.querySelectorAll('.links').length}`;

                        linksContainer.addEventListener('click', (e) => {
                            if (e.target.classList.contains('remove')) {
                                const delSourceBtn = e.target;
                                const linkDiv = delSourceBtn.closest('.links');
                                const linkText = linkDiv.querySelector('a').textContent.trim();
    
                                fetch('ajax/render_pages.php', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                        type: 'save_source',
                                        page: pageNumber,
                                        object: { title: linkText },
                                        action: 'remove',
                                        book: book
                                    })
                                })
                                .then(res=>res.json())
                                .then(data => {
                                    if (data.status == 'success') {
                                        if (linksContainer.contains(linkDiv)) {
                                            linksContainer.removeChild(linkDiv);
                                        }
                                        sourcesCount.textContent = `Sources: ${linksContainer.querySelectorAll('.links').length}`;
                                    } else {
                                        console.log(data.message);
                                    }
                                });
                            }
                        });
                    } else {
                        console.log(data.message);
                    }
                })
            } else {
                console.log('Failed')
            }
            });
        });
    
        cancelBtn.addEventListener('click', () => {
            linksContainer.removeChild(newLinkDiv);
        });
    });

    function loadSources(dataLeft, dataRight) {
        const urlParams = new URLSearchParams(window.location.search);
        const book = urlParams.get('book');
        const pageKey = `${dataLeft}-${dataRight}`;
        fetch(`ajax/render_pages.php?load_sources=true&book=${book}&page_key=${pageKey}`)
        .then(res=>res.json())
        .then(data=>{
            if (data.status == 'success') {
                pagesNumber.textContent = `Pages: ${pageKey}`;
                linksContainer.innerHTML = '';

                const links = data.links;
                if (Object.keys(links).length === 0) {
                    sourcesCount.textContent = 'Sources: 0';
                    return;
                }

                Object.values(links).forEach(link => {
                    const newLinkDiv = document.createElement('div');
                    newLinkDiv.classList.add('links');
                    newLinkDiv.innerHTML = `
                        <a target="_blank" href="${link.url}">${link.title}</a>
                        <i class="fa fa-pencil edit" aria-hidden="true"></i>
                        <i id="del-source" class="fa fa-times remove" aria-hidden="true"></i>
                    `;

                    linksContainer.appendChild(newLinkDiv);

                    linksContainer.addEventListener('click', (e) => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const book = urlParams.get('book');

                        if (e.target.classList.contains('remove')) {
                            const delSourceBtn = e.target;
                            const linkDiv = delSourceBtn.closest('.links');
                            const linkText = linkDiv.querySelector('a').textContent.trim();

                            fetch('ajax/render_pages.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    type: 'save_source',
                                    page: pageKey,
                                    object: { title: linkText },
                                    action: 'remove',
                                    book: book
                                })
                            })
                            .then(res=>res.json())
                            .then(data => {
                                if (data.status == 'success') {
                                    if (linksContainer.contains(linkDiv)) {
                                        linksContainer.removeChild(linkDiv);
                                    }
                                    sourcesCount.textContent = `Sources: ${linksContainer.querySelectorAll('.links').length}`;
                                } else {
                                    console.log(data.message);
                                }
                            });
                        }
                    });
                });

                sourcesCount.textContent = `Sources: ${Object.keys(links).length}`;
            } else {
                console.log('Failed to load sources:', data.message);
            }
        })
        .catch(err => console.error('Error sources:', err));
    }
});