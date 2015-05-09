function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}



BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}





BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest(),
        mult = typeof url != 'string',
        srcInd = 0;
    request.open("GET", mult ? url[srcInd++] : url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    if(!mult || srcInd == url.length) {
                        console.error('error decoding file data:', url);
                        return;
                    } else {
                        console.info('error decoding file data, trying next source');
                        request.open("GET", url[srcInd++], true);
                        return request.send();
                    }
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                if(!mult || srcInd == url.length) {
                    console.error('decodeAudioData error:', url);
                    return;
                } else {
                    console.info('decodeAudioData error, trying next source');
                    request.open("GET", url[srcInd++], true);
                    return request.send();
                }
            }
        );
    }

    request.onerror = function() {
        if(!mult || srcInd == url.length) {
            console.error('BufferLoader XHR error:', url);
            return;
        } else {
            console.info('BufferLoader XHR error, trying next source');
            request.open("GET", url[srcInd++], true);
            return request.send();
        }
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}
