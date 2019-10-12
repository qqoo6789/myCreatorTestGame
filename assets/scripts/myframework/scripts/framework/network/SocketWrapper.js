

/**
 * SocketManager Client
 *
 */


let SocketCallback = function(wrapper, evtCb) {
    this._socket = wrapper._socket;
    this._socketId = wrapper._socketId;
    this._evtCb = evtCb;
    this._socket.onopen = () => {
        cc.log("Connection onopen:", this._socketId);
        if (evtCb != null) {
            evtCb("onopen", null);
        }
    };
    this._socket.onerror = (evt) => {
        cc.error("onerror");
        if (evtCb != null) {
            evtCb("onerror", null);
        }
    };
    this._socket.onclose = (evt) => {
        cc.log("Connection onclose:", this._socketId);

        if (this._socket != wrapper._socket) {
            cc.log("onclose, this._socket != wrapper._socket!!!");
            return;
        }
        this._socket = null;
        wrapper._socket = null;
        if (evtCb != null) {
            evtCb("onclose", null);
        }
    };
    this._socket.onmessage = (evt) => {
        cc.log("onmessage:", this._socketId);
        if (this._socket != wrapper._socket) {
            cc.log("onmessage, this._socket != wrapper._socket!!!");
            return;
        }
        if (evtCb != null) {
            evtCb("onmessage", evt);
        }
        //wrapper._recvMessage(evt.data);
    };
    this.printinfo = () => {
        cc.log("printinfo, this._socketId=" + this._socketId);
        cc.log("printinfo, wrapper._socketId=" + wrapper._socketId);
    };

}; 
//----------------------------------------------------------------------------------------------------------------------

let SocketWrapper = function () {
    this._init();
};



SocketWrapper.prototype = {
    constructor: SocketWrapper,
    _init: function () {

        this._socket = null;
        this._socketId = 10000;
        this._encrypt = false;
        cc.log("SocketWrapper init");
        return true;
    },

    /**
     * 是否已经连接
     */
    isConnected() {
        if (this._socket != null) {
            return this._socket.readyState == WebSocket.OPEN;
        }
    
        return false;
    },

    /**
     * 建立连接
     * @param {String} ip 
     * @param {Number} port 
     * @param {Function} evtCb 事件回调
     * @param {Boolean} encrypt 是否加密
     */
    socketConnection(ip, port, evtCb, encrypt) {
        if (this._socket != null) {
            cc.warn("socketConnection, this._socket != null");
            return;
        }
    
        if (window.WebSocket) {
            var ip_ = "";
            var port_ = 0;
            if (arguments.length > 0) {
                ip_ = ip;
                port_ = port;
            }
    
            if (ip_ == null || ip_ == "" || port_ == null || port_ == 0) {
                return;
            }
            
            this._encrypt = encrypt;

            if(this._encrypt)
            {
                this._socket = new WebSocket("wss://" + ip_ + ":" + port_);  //小米h5需要wss
            }
            else
            {
                this._socket = new WebSocket("ws://" + ip_ + ":" + port_);
            }    
            
            this._socketId++;
            cc.log("ready to connect ip = " + ip + " port: " + port);
            this._socket.binaryType = "arraybuffer"; // We are talking binary
    
            var socketCallback = new SocketCallback(this, evtCb);
            //socketCallback.printinfo();    
        }
    },

    closeSocket() {
        cc.log("socketwrapper close socket");
        if (this._socket != null) {
            this._socket.close();
            //this._socket = null;
        }
    },

    sendMessage(data) {
        if (this._socket) {
            if (this._socket.readyState == WebSocket.OPEN) {
                this._socket.send(data);
            } else {
                cc.log("Not connected\n");
            }
        } else {
            cc.log("sendMessage, this._socket=" + this._socket);
        }
    },

   
}

module.exports = new SocketWrapper();
