import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {BsArrowLeftCircle, BsArrowRightCircle} from 'react-icons/bs'

import UserList from '../UserList'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserDetails extends Component {
  state = {
    apiStatus: apiConstants.initial,
    entriesData: [],
    searchInput: '',
    itemsRange: 9,
    startItemNumber: 0,
    endItemNumber: 9,
    currentPageNumber: 1,
  }

  componentDidMount() {
    this.getDataFromApi()
  }

  displayPreviousPage = () => {
    const {currentPageNumber, itemsRange} = this.state
    if (currentPageNumber > 1) {
      this.setState(prevState => ({
        startItemNumber: prevState.startItemNumber - itemsRange,
        endItemNumber: prevState.endItemNumber - itemsRange,
        currentPageNumber: prevState.currentPageNumber - 1,
      }))
    }
  }

  displayNextPage = () => {
    const {entriesData, itemsRange, currentPageNumber} = this.state
    const entriesDataLength = entriesData.length
    const totalPagesNumber = entriesDataLength / itemsRange
    if (currentPageNumber < totalPagesNumber) {
      this.setState(prevState => ({
        startItemNumber: prevState.startItemNumber + itemsRange,
        endItemNumber: prevState.endItemNumber + itemsRange,
        currentPageNumber: prevState.currentPageNumber + 1,
      }))
    }
  }

  getDataFromApi = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const dataUrl =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    const options = {
      method: 'GET',
    }
    const response = await fetch(dataUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        entriesData: data,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onDeleteUser = id => {
    const {entriesData} = this.state
    const updatedData = entriesData.filter(eachData => eachData.id !== id)
    this.setState({entriesData: updatedData})
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value.toLowerCase()})
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader
        type="TailSpin"
        className="text-center"
        color="#00BFFF"
        height={50}
        width={50}
      />
    </div>
  )

  renderPaginationContainer = () => {
    const {entriesData, itemsRange, currentPageNumber} = this.state
    const entriesDataLength = entriesData.length
    const totalPagesNumber = Math.ceil(entriesDataLength / itemsRange)
    return (
      <div className="home-pagination-buttons-container">
        <button
          className="pagination-button"
          type="button"
          onClick={this.displayPreviousPage}
        >
          <BsArrowLeftCircle size="30px" />
        </button>
        <p className="current-page-number">{`Page ${currentPageNumber} Of ${totalPagesNumber} Pages`}</p>
        <button
          className="pagination-button"
          type="button"
          onClick={this.displayNextPage}
        >
          <BsArrowRightCircle size="30px" />
        </button>
      </div>
    )
  }

  renderEntriesList = () => {
    const {
      entriesData,
      startItemNumber,
      endItemNumber,
      searchInput,
    } = this.state
    console.log(searchInput)
    const thisPageList = entriesData.slice(startItemNumber, endItemNumber)
    return (
      <div className="list-container">
        <div className="list-headings-container">
          <input type="checkbox" className="list-checkbox-input" />
          <p className="list-heading-text">Name</p>
          <p className="list-heading-text">Email</p>
          <p className="list-heading-text">Role</p>
          <p className="list-heading-text">Actions</p>
        </div>
        <hr className="entry-head-bottom-line" />
        <ul className="entries-list">
          {thisPageList.map(eachItem => (
            <UserList
              key={eachItem.id}
              userLists={eachItem}
              onDeleteUser={this.onDeleteUser}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="api-failure-view-container">
      <img
        src="https://res.cloudinary.com/dgahohki4/image/upload/v1636698000/Group_7484_d8dbn4.png"
        className="image"
        alt="NotFound"
      />
      <h1 className="api-failure-heading">Network Error</h1>
      <p className="api-failure-text">We Are Sorry For The Inconvenience...</p>
      <button type="button" className="button" onClick={this.getDataFromApi()}>
        Retry
      </button>
    </div>
  )

  renderListContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderEntriesList()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="container">
        <div className="content-container">
          <input
            className="search-input"
            placeholder="Search by name email or role"
            type="text"
            onChange={this.onChangeSearchInput}
          />
          {this.renderListContainer()}
        </div>
        {this.renderPaginationContainer()}
      </div>
    )
  }
}

export default UserDetails
