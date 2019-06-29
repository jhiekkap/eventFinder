import React from "react";
import Modal from "react-modal";
import "./OwnModal.css";
import InterestingEvent from "../InterestingEvent/InterestingEvent";
import Tags from "../Tags/Tags"
import Favorites from "../Favorites/Favorites"
import SignUp from "../SignUp/SignUp"
import Login from "../Login/Login"


/* const customStyles = {
  content: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    marginRight: "0",
    background: "none",
    zIndex: 500
  } 
}; */

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)'
  },
  content: {
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px'
  }
}

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

class OwnModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed. 
  }

  closeModal() {
    //this.setState({ modalIsOpen: false });
    this.props.setShowModal(false)
    this.props.setShowTags(false)
    this.props.setShowInterestingEvent(false)
    this.props.setShowFavoriteEvents(false)
    this.props.setShowSignUp(false)
    this.props.setShowLogin(false)
  }

  render() {
    return (
      <div> 
        <Modal
          //isOpen={this.state.modalIsOpen}
          isOpen={this.props.showModal}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          closeTimeoutMS={500}
        >

          {/*  <button id="closeButton" onClick={this.closeModal}>
              close
            </button> */}

          <Tags
            allTags={this.props.allTags}
            setAllTags={this.props.setAllTags}
            showTags={this.props.showTags}
            setShowTags={this.props.setShowTags}
            events={this.props.events}
            setEvents={this.props.setEvents}
            allEvents={this.props.allEvents}
            setShowModal={this.props.setShowModal}   
            textSearch={this.props.textSearch}
            setTextSearch={this.props.setTextSearch}
            setInterestingEvent={this.props.setInterestingEvent}
            setShowInterestingEvent={this.props.setShowInterestingEvent} 
            timeFilter={this.props.timeFilter} 
            setTimeFilter={this.props.setTimeFilter}
            firstTimeHere={this.props.firstTimeHere}
            setFirstTimeHere={this.props.setFirstTimeHere}
            fetchEventsFromServer={this.props.fetchEventsFromServer}
            location={this.props.location}
            setZoom={this.props.setZoom}
            isLoading={this.props.isLoading}
            setIsLoading={this.props.setIsLoading}
            distance={this.props.distance}
            setDistance={this.props.setDistance}
          />
          <InterestingEvent
            showInterestingEvent={this.props.showInterestingEvent}
            setShowInterestingEvent={this.props.setShowInterestingEvent}
            interestingEvent={this.props.interestingEvent}
            favoriteEvents={this.props.favoriteEvents}
            setFavoriteEvents={this.props.setFavoriteEvents}
            setShowFavoriteEvents={this.props.setShowFavoriteEvents}
            setShowModal={this.props.setShowModal}
            setShowTags={this.props.setShowTags}
          />
          <Favorites
            favoriteEvents={this.props.favoriteEvents}
            showFavoriteEvents={this.props.showFavoriteEvents}
            setFavoriteEvents={this.props.setFavoriteEvents}
            setShowFavoriteEvents={this.props.setShowFavoriteEvents}
            setShowInterestingEvent={this.props.setShowInterestingEvent}
            setInterestingEvent={this.props.setInterestingEvent}
            setShowModal={this.props.setShowModal}
          />
          <SignUp 
            setIsLogged={this.props.setIsLogged}
            setLoggedUser={this.props.setLoggedUser}
            setShowModal={this.props.setShowModal}
            showSignUp={this.props.showSignUp}
            setShowSignUp={this.props.setShowSignUp}
            favoriteEvents={this.props.favoriteEvents}
          />
          <Login 
            setIsLogged={this.props.setIsLogged} 
            setLoggedUser={this.props.setLoggedUser}
            setShowModal={this.props.setShowModal}
            showLogin={this.props.showLogin}
            setShowLogin={this.props.setShowLogin}s
            setFavoriteEvents={this.props.setFavoriteEvents}
          />
        </Modal>

      </div>
    );
  }
}

export default OwnModal;
