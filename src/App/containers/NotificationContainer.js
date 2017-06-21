import { connectModel } from 'react-redux-models'
import NotificationSystem from 'react-notification-system'

class NotificationContainer extends React.PureComponent {
  setRef = (ref) => this.system = ref

  componentWillMount() {
    if (this.props.notifications.pendingAddItem != null) {
      this.props.actions.addNotificationDone();
    }

    if (this.props.notifications.pendingRemoveItemId != null) {
      this.props.actions.removeNotificationDone();
    }

    // Clear
    if (this.props.notifications.isPendingClear === true) {
      this.props.actions.clearNotificationDone();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const oldData = this.props.notifications;
    const newData = nextProps.notifications;

    // Add
    if (oldData.pendingAddItem == null && newData.pendingAddItem) {
      this.system.addNotification(newData.pendingAddItem);
      this.props.actions.addNotificationDone();
    }

    // Remove
    if (oldData.pendingRemoveItemId == null && newData.pendingRemoveItemId) {
      this.system.removeNotification(newData.pendingRemoveItemId);
      this.props.actions.removeNotificationDone();
    }

    // Clear
    if (oldData.isPendingClear === false && newData.isPendingClear === true) {
      this.system.clearNotifications();
      this.props.actions.clearNotificationDone();
    }
  }

  render() {
    return (
      <NotificationSystem ref={this.setRef}/>
    );
  }
}

export default connectModel({
  stateSelector: (state) => ({
    notifications: state.system.notifications
  }),
  importActions: {
    NotificationModel: ['addNotificationDone', 'removeNotificationDone', 'clearNotificationDone']
  }
})(NotificationContainer);

