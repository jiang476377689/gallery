'use strict';

var React = require('react/addons');
//var ReactDOM = require('react-dom');
var MediaQuery = require('react-responsive');
// CSS
require('normalize.css');
require('../styles/main.scss');

var mImageJsonData = require('../data/imageDatas.json');

mImageJsonData = (function getImageArray(imgJsonArr) {
  for(let i = 0; i < imgJsonArr.length; i++) {
    let singleImageData = imgJsonArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
    imgJsonArr[i] = singleImageData;
  }
  return imgJsonArr;
})(mImageJsonData);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

function getDegreeRandom(defValue = 30) {
  let random = Math.random();
  return (random > 0.5 ? '' : '-') + Math.ceil(random * defValue);
}

var ImageFigure = React.createClass({

  getInitialState: function() {
    return ({
      inverse: false
    });
  },

  handleClick: function(e) {
    if (this.props.position.isCenter) {
      this.props.inverse();
      this.setState({
        inverse: !this.state.inverse
      });
    } else {
      this.props.center();
      this.setState({
        inverse: false
      });
    }
    e.stopPropagation();
    e.preventDefault();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    let needUpdate = true;
    let curPos = this.props.position, nextPos = nextProps.position;
    console.log('current center : ' + curPos.isCenter + ' next center : ' + nextPos.isCenter + ' center !== ' + (curPos.isCenter !== nextPos.isCenter)
    + ' current rotate : ' + curPos.rotate + ' next rotate : ' + nextPos.rotate + ' rotate !== ' + (curPos.rotate !== nextPos.rotate)
     + ' current left : ' + curPos.pos.left + ' next left : ' + nextPos.pos.left + ' left !== ' + (curPos.pos.left !== nextPos.pos.left)
      + ' current top : ' + curPos.pos.top + ' next top : ' + nextPos.pos.top + ' top !== ' + (curPos.pos.top !== nextPos.pos.top)
      + ' current inverse : ' + curPos.isInverse + ' next inverse : ' + nextPos.isInverse + ' inverse !== ' + (curPos.isInverse !== nextPos.isInverse)
      + ' current state inverse : ' + this.state.inverse + ' next state inverse : ' + nextState.inverse);
    needUpdate = (curPos.isCenter !== nextPos.isCenter) || (curPos.rotate !== nextPos.rotate)
     || (curPos.pos.left !== nextPos.pos.left) || (curPos.pos.top !== nextPos.pos.top) || (this.state.inverse !== nextState.inverse);
    return needUpdate;
  },

  render: function() {

    var styleObj = {};
    if (this.props.position.pos) {
      styleObj = this.props.position.pos;
    }
    if (this.props.position.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', '']).forEach(function(value) {
        styleObj[value] = 'rotate(' + this.props.position.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.position.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.position.isInverse ? ' is-inverse' : '';
    var imgBackClassName = 'img-back';
    var imgTitleClassName = 'img-title';
    var styleImage = {
			display: 'block',
			width: '240px',
			height: '240px'
		};
    var isMobile = this.props.mobile;

    if (isMobile) {
      imgFigureClassName = 'mobile-img-figure' + (this.props.position.isInverse ? ' mobile-is-inverse' : '');
      styleImage = {
        display: 'block',
        width: '120px',
        height: '110px'
      };
      imgBackClassName = 'mobile-img-back';
      imgTitleClassName = 'mobile-img-title';
    }

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} style={styleImage} alt={this.props.data.title}/>
        <figcaption>
          <h2 className={imgTitleClassName}>{this.props.data.title}</h2>
          <div className={imgBackClassName} onClick={this.handleClick}>
            <p>
              {this.props.data.description}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

var ControllerUnit = React.createClass({

  handleClick: function(e) {
    if (this.props.position.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  },

  render: function() {
    var unitClassName = 'nav-unit';
    if (this.props.position.isCenter) {
      unitClassName += ' is-center';
      if (this.props.position.isInverse) {
        unitClassName += ' is-inverse';
      }
    }

    return (
      <span className={unitClassName} onClick={this.handleClick}></span>
    );
  }
});

var PCReactGallery = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  getInitialState: function() {
    return {
      imgsPositionArray: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }*/
      ]
    };
  },

  inverse: function(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsPositionArray;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsPositionArray: imgsArrangeArr
      });
    }.bind(this);
  },

  componentDidMount: function() {
    let _this = this;
    var stageDom = React.findDOMNode(_this.refs.stage);
    var stageW = stageDom.scrollWidth;
    var stageH = stageDom.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
      console.log('stage width: ' + stageW + ' state height: ' + stageH);
      var imgFigureDom = React.findDOMNode(_this.refs.imgFigure0);
      var imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
      console.log('image width: ' + imgW + ' image height: ' + imgH);
      _this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      };

      _this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      _this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

      _this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      _this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      _this.Constant.hPosRange.y[0] = -halfImgH;
      _this.Constant.hPosRange.y[1] = stageH - halfImgW;

      _this.Constant.vPosRange.topY[0] = -halfImgH;
      _this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      _this.Constant.vPosRange.x[0] = halfStageW - imgW;
      _this.Constant.vPosRange.x[1] = halfStageW + imgW;

      _this.reArrangeStage(0);

  },

  center: function(index) {
    return function() {
      this.reArrangeStage(index);
    }.bind(this);
  },

  reArrangeStage: function(centerIndex) {
    var imgsArrangeArr = this.state.imgsPositionArray;
    var Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach(function(value, index) {
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: getDegreeRandom(),
            isCenter: false
          };
        });

        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          var hPosRangeLOrX = null;

          if (i < k) {
            hPosRangeLOrX = hPosRangeLeftSecX;
          } else {
            hPosRangeLOrX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLOrX[0], hPosRangeLOrX[1])
            },
            rotate: getDegreeRandom(),
            isCenter: false
          };
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsPositionArray: imgsArrangeArr
        });
  },

  render: function() {

    var controllerUnits = [],
        imageFigures = [];
    mImageJsonData.forEach(function(value, index) {
      if (!this.state.imgsPositionArray[index]) {
        this.state.imgsPositionArray[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      let imgFigurePosion = this.state.imgsPositionArray[index];
      imageFigures.push(<ImageFigure key={index} data={value} ref={'imgFigure' + index} position={imgFigurePosion} mobile={false} inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index} position={this.state.imgsPositionArray[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav key="appnavsection" className="nav-sec">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

var MobileReactGallery = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    lrPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      topY: [0, 0]
    },
    hPosRange: {
      x: [0, 0],
      topY: [0, 0],
      downY: [0, 0]
    }
  },

  getInitialState: function() {
    return {
      imgsPositionArray: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }*/
      ]
    };
  },

  inverse: function(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsPositionArray;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsPositionArray: imgsArrangeArr
      });
    }.bind(this);
  },

  componentDidMount: function() {
    let _this = this;
    var stageDom = React.findDOMNode(_this.refs.stage);
    var stageW = stageDom.scrollWidth;
    var stageH = stageDom.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
      console.log('stage width: ' + stageW + ' state height: ' + stageH);
      var imgFigureDom = React.findDOMNode(_this.refs.imgFigure0);
      var imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
      console.log('image width: ' + imgW + ' image height: ' + imgH);
      _this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      };

      var mobileOffset = 25;
      //left sec position
      _this.Constant.lrPosRange.topY[0] = halfStageH - imgH;
      _this.Constant.lrPosRange.topY[1] = halfStageH + halfImgH;
      _this.Constant.lrPosRange.leftSecX[0] = -halfImgW;
      _this.Constant.lrPosRange.leftSecX[1] = halfStageW - imgH - mobileOffset;

      //right sec position
      _this.Constant.lrPosRange.rightSecX[0] = halfStageW + halfImgW + mobileOffset;
      _this.Constant.lrPosRange.rightSecX[1] = stageW - halfImgW;

      //手机上部分Y范围
      _this.Constant.hPosRange.topY[0] = -halfImgH;
      _this.Constant.hPosRange.topY[1] = halfStageH - halfImgH * 3 - mobileOffset;
      //手机下部分Y范围
      _this.Constant.hPosRange.downY[0] = halfStageH + halfImgH + mobileOffset;
      _this.Constant.hPosRange.downY[1] = stageH - imgH;
      //手机水平区域X范围
      _this.Constant.hPosRange.x[0] = -halfImgW;
      _this.Constant.hPosRange.x[1] = stageW - halfImgW;

      _this.reArrangeStage(0);

  },

  center: function(index) {
    return function() {
      this.reArrangeStage(index);
    }.bind(this);
  },

  reArrangeStage: function(centerIndex) {
    var imgsArrangeArr = this.state.imgsPositionArray;
    var Constant = this.Constant,
        centerPos = Constant.centerPos,
        imgsArrangeTopArr = [],
        topImgSpliceIndex = 0,
        imgsArrangeDownArr = [],
        downImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    var randomNum = Math.random();
    var topImgNum = 4, bottomNum = 4;
    if (randomNum > 0.4) {
      topImgNum = 5;
    }

        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach(function(value, index) {
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(Constant.hPosRange.topY[0], Constant.hPosRange.topY[1]),
              left: getRangeRandom(Constant.hPosRange.x[0], Constant.hPosRange.x[1])
            },
            rotate: getDegreeRandom(),
            isCenter: false
          };
        });

        downImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - bottomNum));
        imgsArrangeDownArr = imgsArrangeArr.splice(downImgSpliceIndex, bottomNum);
        imgsArrangeDownArr.forEach(function(value, index) {
          imgsArrangeDownArr[index] = {
            pos: {
              top: getRangeRandom(Constant.hPosRange.downY[0], Constant.hPosRange.downY[1]),
              left: getRangeRandom(Constant.hPosRange.x[0], Constant.hPosRange.x[1])
            },
            rotate: getDegreeRandom(),
            isCenter: false
          };
        });

        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          var hPosRangeLOrX = null;
          if (i > k) {
            hPosRangeLOrX = [Constant.lrPosRange.leftSecX[0], Constant.lrPosRange.leftSecX[1]];
          } else {
            hPosRangeLOrX = [Constant.lrPosRange.rightSecX[0], Constant.lrPosRange.rightSecX[1]];
          }

          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(Constant.lrPosRange.topY[0], Constant.lrPosRange.topY[1]),
              left: getRangeRandom(hPosRangeLOrX[0], hPosRangeLOrX[1])
            },
            rotate: getDegreeRandom(15),
            isCenter: false
          };
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr.length > 0) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, ...imgsArrangeTopArr);
        }
        if (imgsArrangeDownArr && imgsArrangeDownArr.length > 0) {
          imgsArrangeArr.splice(downImgSpliceIndex, 0, ...imgsArrangeDownArr);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsPositionArray: imgsArrangeArr
        });
  },

  render: function() {

    var controllerUnits = [],
        imageFigures = [];
    mImageJsonData.forEach(function(value, index) {
      if (!this.state.imgsPositionArray[index]) {
        this.state.imgsPositionArray[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      let imgFigurePosion = this.state.imgsPositionArray[index];
      imageFigures.push(<ImageFigure key={index} data={value} ref={'imgFigure' + index} position={imgFigurePosion} mobile={true} inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnits.push(<ControllerUnit key={index} position={this.state.imgsPositionArray[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav key="appnavsection" className="nav-sec">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

var ReactLearnDemoApp = React.createClass({
  render: function() {
    return (
      <div className="content">
        <MediaQuery query='(min-device-width: 1224px)'>
          <PCReactGallery />
        </MediaQuery>
        <MediaQuery query='(max-device-width: 1224px)'>
          <MobileReactGallery />
        </MediaQuery>
      </div>
    );
  }
});
React.render(<ReactLearnDemoApp />, document.getElementById('content')); // jshint ignore:line

module.exports = ReactLearnDemoApp;
