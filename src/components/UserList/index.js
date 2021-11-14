import {Component} from 'react'

import {MdDeleteOutline} from 'react-icons/md'
import {AiOutlineForm} from 'react-icons/ai'

import './index.css'

class UserList extends Component {
  render() {
    const {userLists, onDeleteUser} = this.props
    const {id, name, email, role} = userLists
    const deleteUser = () => {
      onDeleteUser(id)
    }

    return (
      <li className="list-item">
        <div className="list-item-container">
          <input type="checkbox" className="list-checkbox-input" />
          <p className="list-text">{name}</p>
          <p className="list-text">{email}</p>
          <p className="list-text">{role}</p>
          <div className="list-item-icons">
            <AiOutlineForm size="18px" />
            <button
              onClick={deleteUser}
              className="delete-button"
              type="button"
            >
              <MdDeleteOutline size="22px" color="red" />
            </button>
          </div>
        </div>
        <hr className="entry-head-bottom-line" />
      </li>
    )
  }
}

export default UserList
