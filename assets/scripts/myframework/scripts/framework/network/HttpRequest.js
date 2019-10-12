/**
 * Http Request Login NetInfo
 *
 */


 //----------------------------------------------------------------------------------------------------------------------

module.exports = yx.http = {
    // httpRequest(url, callback) {
    //     var xhr = new XMLHttpRequest();
    //     var err = false;
    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
    //             err = false;
    //         } else {
    //             err = true;
    //         }
    //         var response = xhr.responseText;
    //         callback(err, response);
    //         console.log("======" + response);
    //     };
    //     xhr.open("POST", url);
    //     xhr.send();
    // },

    //发送POST消息
    httpPost(url, data, callback){
        var request = new XMLHttpRequest();
   
        request._tempUrl = url;
        request.ontimeout = function (e) {
            callback(false, "timeout");
        };
        request.onerror = function (e) {
            cc.log("request.onerror, e=" + e);
            callback(false, "neterror");
        };
        request.onreadystatechange = function () {
            cc.log("request.readyState=" + request.readyState + ", request.status=" + request.status);
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status <= 207) {
                    callback(true, request.response);
                } else {
                    //if (!this._retryReq(request)) {
                        callback(false, "status error:" + request.status);
                    //}
                }
            }
        };

        request.open("POST", request._tempUrl, true);
   
        //test code
        //request.setRequestHeader("Access-Control-Allow-Origin", "*");
        request.setRequestHeader("Content-Type", "application/json");
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        request.timeout = 6000; // 6 seconds for timeout
        request.send(data);
    },

    //发送GET消息
    httpGet(url, callback) {
        var request = new XMLHttpRequest();
        //var request = new XMLHttpRequest();
        //console.log("Status: Send Get Request to " + url);
        //request.withCredentials = false;

        request._tempUrl = url;
        request.ontimeout = function (e) {
            callback(false, "timeout");
        };
        request.onerror = function (e) {
            cc.log("request.onerror, e=" + e);
            callback(false, "neterror");
        };
        request.onreadystatechange = function () {
            cc.log("request.readyState=" + request.readyState + ", request.status=" + request.status);
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status <= 207) {
                    callback(true, request);
                } else {
                    //if (!this._retryReq(request)) {
                        callback(false, "status error:" + request.status);
                    //}
                }
            }
        };

        this._sendReq(request);
    },

    _sendReq(request) {
        try {
            request.open("GET", request._tempUrl, true);
            if (cc.sys.isNative) {
                request.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            //test code
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            request.timeout = 6000; // 6 seconds for timeout
            request.send();
        } catch (error) {
            cc.log("sendReq, error=" + error);
        }    
    },

    // _retryReq(request) {
    //     return false; //暂时屏蔽重试
    //     // if (request._retryTimerId == -1) {
    //     //     return false;
    //     // }
    //     // cc.log("retryReq, _retryTimerId=" + request._retryTimerId);
    //     // if (!request._retryTimerId) {
    //     //     request._retryTimerId = setTimeout(function () {
    //     //         request._retryTimerId = -1;
    //     //         p.sendReq(request);
    //     //     }, 2000);
    //     // }
    //     // return true;
    // },
    
};
