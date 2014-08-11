var method = myFile.prototype;

function myFile(name,href,size,width,height) {
    this._name = name;
    this._href = href;
    this._size = size;
    this._width=width;
    this._height=height;
}

method.getName = function() {
    return this._name;
};
method.toJson=function(){
   return {'image':this._href,'width':this._width,'height':this._height };
}

module.exports = myFile;
