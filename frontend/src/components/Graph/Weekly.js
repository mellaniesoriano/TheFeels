import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWeekEntries } from '../../actions';
import demoGraph from '../../assets/graph.png';
import SingleEntry from './SingleEntry';
import AngryIcon from '../../assets/anger.jpg';
import DisgustIcon from '../../assets/disgust.jpg';
import FearIcon from '../../assets/fear.jpg';
import JoyIcon from '../../assets/joy.jpg';
import SadnessIcon from '../../assets/sadness.jpg';
import SingleKeyword from './SingleKeyword';

class Weekly extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      currentView: null,
      activeModal: null
    };

    this.modalHander = this.modalHander.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentWillMount() {
    this.props.getWeekEntries();
  }

  modalHander(e, index) {
    this.setState({
      activeModal: index
    });
  }

  hideModal() {
    this.setState({
      activeModal: null
    });
  }

  emotionIcon(e) {
    let emotionData = {
      angerScore: e.angerScore,
      disgustScore: e.disgustScore,
      fearScore: e.fearScore,
      joyScore: e.joyScore,
      sadnessScore: e.sadnessScore
    };
    let highestNum = 0;
    let highestEmotion = '';
    Object.entries(emotionData).forEach(([key, value]) => {
      if (value > highestNum) {
        highestNum = value;
        highestEmotion = key;
      }
    });
    switch (highestEmotion) {
      case 'angerScore':
        return {
          icon: AngryIcon,
          style: { backgroundColor: '#F95738', borderColor: '#F95738' }
        };
      case 'disgustScore':
        return {
          icon: DisgustIcon,
          style: { backgroundColor: '#4a7c59', borderColor: '#4a7c59' }
        };
      case 'fearScore':
        return {
          icon: FearIcon,
          style: {
            backgroundColor: '#353129',
            borderColor: '#353129',
            color: '#ecf1fa'
          }
        };
      case 'joyScore':
        return {
          icon: JoyIcon,
          style: { backgroundColor: '#f7ed83', borderColor: '#f7ed83' }
        };
      case 'sadnessScore':
        return {
          icon: SadnessIcon,
          style: { backgroundColor: '#084887', borderColor: '#084887' }
        };
      default:
        return null;
    }
  }

  loadKeywords() {
    if (Array.isArray(this.props.weekEntries.keywordSummary)) {
      return this.props.weekEntries.keywordSummary.map(keyword => {
        return (
          <div key={keyword.sentimentScore} className="column is-narrow">
            <button
              className="button keywordButton"
              style={this.emotionIcon(keyword).style}
              onClick={e => this.modalHander(e, keyword.keyword)}
            >
              <span className="icon is-small">
                <i className="fa fa-pie-chart" />
              </span>
              <span>{keyword.keyword}</span>
            </button>
            <SingleKeyword
              show={this.state.activeModal === keyword.keyword}
              onHide={this.hideModal}
              keywordData={keyword}
            />
          </div>
        );
      });
    }
  }

  loadEntries() {
    if (Array.isArray(this.props.weekEntries.entries)) {
      let newArr = this.props.weekEntries.entries;
      return newArr.map(entry => {
        let newDate = new Date(entry.createdAt);
        return (
          <article key={entry.id} className="media">
            <figure className="media-left">
              <p className="image is-64x64">
                <img src={this.emotionIcon(entry).icon} alt="" />
              </p>
            </figure>
            <div className="media-content">
              <div className="content" id="entryText">
                <p id={entry.id} onClick={e => this.modalHander(e, entry.id)}>
                  <small>{newDate.toLocaleString()}</small>
                  <br />
                  {entry.text}
                </p>
              </div>
            </div>
            <SingleEntry
              show={this.state.activeModal === entry.id}
              onHide={this.hideModal}
              entry={entry}
              date={newDate.toLocaleString()}
              emotionIcon={this.emotionIcon(entry)}
            />
          </article>
        );
      });
    }
  }

  render() {
    // this.props.weekEntries.entries - all entries for the week
    // this.props.weekEntries.keywordSummary -  top five keywords for the week
    //console.log(typeof this.props.weekEntries.entries);
    return (
      <div className="container is-mobile">
        <figure className="image is-16by9">
          <img src={demoGraph} alt="demo graph" />
        </figure>

        <br />
        <div className="columns is-multiline is-mobile">
          {this.loadKeywords()}
        </div>
        {this.loadEntries()}
      </div>
    );
  }
}

const mapStatetoProps = state => {
  return { weekEntries: state.weekEntries };
};

const mapDispatchtoProps = dispatch => {
  return {
    getWeekEntries: () => {
      dispatch(getWeekEntries());
    }
  };
};

const ConnectedWeekly = connect(mapStatetoProps, mapDispatchtoProps)(Weekly);

export default ConnectedWeekly;
