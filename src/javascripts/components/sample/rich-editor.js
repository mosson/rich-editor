'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Component, PropTypes } from 'react';


class RichEditor extends Component {
  componentDidMount() {
    this.build();

    this.state = {
      tick: 0
    };
  }

  render() {
    return (
      <div>
        <iframe src="about:blank" ref="editor"/>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'em')}>
        em
        </button>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'i')}>
        i
        </button>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'd')}>
        d
        </button>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'bigger')}>
        bigger
        </button>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'smaller')}>
        smaller
        </button>
        <button type="button"
        onClick={this._surroundHdl.bind(this, 'reset')}>
        reset
        </button>
      </div>

    );
  }

  build() {
    this.document.body.contentEditable = true;
    if(!this.document.querySelector("div")){
      this.document.body.innerHTML = "<div><br/></div>";
    }
  }

  _surroundHdl(elementName) {
    this.setState({tick: this.state.tick ++});

    let selection = this.document.getSelection();
    let range = selection.getRangeAt(0).cloneRange();

    let wrapper;
    if(this.isSameContainer(range)) {
      wrapper = this.surroundTypes[elementName] && this.surroundTypes[elementName](range.startContainer);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      wrapper = this.surroundTypes[elementName] && this.surroundTypes[elementName]();
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);

      let newRange = this.document.createRange();
      newRange.selectNodeContents(wrapper);

      selection.removeAllRanges();
      selection.addRange(newRange);
    }


    this.node && this.node.focus();

  }

  isSameContainer(range) {
    return range.startContainer === range.endContainer &&
    range.startContainer !== this.document.body &&
    range.startContainer.nodeType === 1;
  }

  get node() {
    return ReactDOM.findDOMNode(this.refs.editor);
  }

  get document() {
    if(!this.node) return;
    return this.node.contentWindow.document;
  }

  get surroundTypes() {
    if(!this._surroundTypes) {
      this._surroundTypes = {
        "em": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          span.style.fontWeight = "bold";
          return span;
        },
        "i": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          span.style.fontStyle = "italic";
          return span;
        },
        "d": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          let cur = parseFloat(span.style.lineHeight);
          if( isNaN(cur)) cur = 1;
          span.style.lineHeight = cur + 0.1;
          return span;
        },
        "bigger": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          let cur = parseFloat(span.style.fontSize);
          if(isNaN(cur)) cur = 100;
          span.style.fontSize = `${cur + 10}%`;
          return span;
        },
        "smaller": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          let cur = parseFloat(span.style.fontSize);
          if(isNaN(cur)) cur = 100;
          span.style.fontSize = `${cur - 10}%`;
          return span;
        },
        "reset": (c) => {
          let span;
          if(c) {
            span = c;
          } else {
            span = this.document.createElement("span");
          }
          return span;

          // get plain textContent and append to climb up div

        }
      }
    }

    return this._surroundTypes;

  }
}

export default RichEditor;
