import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    fetchedData: {},
  }

  componentDidMount() {
    this.getCovidData()
  }

  getCovidData = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      const convertedData = {
        updatedLast7DaysData: data.last_7_days_vaccination,
        updatedVaccinationByAge: data.vaccination_by_age,
        updatedVaccinationByGender: data.vaccination_by_gender,
      }

      this.setState({
        apiStatus: apiStatusConstant.success,
        fetchedData: convertedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {fetchedData} = this.state

    const {
      updatedLast7DaysData,
      updatedVaccinationByGender,
      updatedVaccinationByAge,
    } = fetchedData

    return (
      <div className="dataContainer">
        <VaccinationCoverage updatedLast7DaysData={updatedLast7DaysData} />
        <VaccinationByGender vaccinationByGender={updatedVaccinationByGender} />
        <VaccinationByAge vaccinationByAge={updatedVaccinationByAge} />
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failureImage"
      />
      <h1 className="failureHeading">Something went wrong</h1>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowinDashboardBgContainer">
        <div className="logoContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="websiteLogoImage"
          />
          <h1 className="mainHeading">Co-win</h1>
        </div>
        <h1 className="mainHeading2">CoWIN Vaccination in India</h1>
        <div className="overAllContainer">{this.renderViews()}</div>
      </div>
    )
  }
}

export default CowinDashboard
