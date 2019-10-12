//require('./framework/FrameWork')


let colorUtil = {
    TextYellowDark:     "#FFD066",
    TextYellowLight:    "#EDD49B",
    TextGreen:          "#00C800",
    TextRed:            "#FF0000",
    TextBlueLigth:      "#98BAF0",
    TextWhite:          "#FFFFFF",
    TextGray:          "#666666",

    AddColorString: function(text, color){
        return "<color=" + color + ">" + text + "</c>";
    },

    toCCColor: function(color){
        return new cc.Color().fromHEX(color);
    },
}


module.exports = yx.colorUtil = colorUtil;