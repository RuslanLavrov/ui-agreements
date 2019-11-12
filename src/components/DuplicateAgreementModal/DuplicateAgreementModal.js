import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, mapValues, pickBy } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Modal,
} from '@folio/stripes/components';

import css from './DuplicateAgreementModal.css';

export default class DuplicateAgreementModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onClone: PropTypes.func,
  };

  constructor() {
    super();

    this.cloneableProperties = {
      'agreementInfo': <FormattedMessage id="ui-agreements.duplicateAgreementModal.agreementInfo" />,
      'internalContacts': <FormattedMessage id="ui-agreements.duplicateAgreementModal.internalContacts" />,
      'agreementLines': <FormattedMessage id="ui-agreements.duplicateAgreementModal.agreementLines" />,
      'linkedLicenses': <FormattedMessage id="ui-agreements.duplicateAgreementModal.linkedLicenses" />,
      'externalLicenses': <FormattedMessage id="ui-agreements.duplicateAgreementModal.externalLicenses" />,
      'organizations': <FormattedMessage id="ui-agreements.duplicateAgreementModal.organizations" />,
      'supplementaryInformation': <FormattedMessage id="ui-agreements.duplicateAgreementModal.supplementaryInformation" />,
      'usageData': <FormattedMessage id="ui-agreements.duplicateAgreementModal.usageData" />
    };

    const initialSelectedObject = mapValues(this.cloneableProperties, () => false);

    this.state = {
      selected: initialSelectedObject
    };
  }

  updateSelection = (e) => {
    const name = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => (
      {
        selected: { ...prevState.selected, [name]: isChecked }
      }));
  };

  toggleSelectAll = (e) => {
    const selectAllObject = mapValues(this.cloneableProperties, () => true);
    const isChecked = e.target.checked;

    this.setState(() => (
      {
        selected: isChecked ? selectAllObject : []
      }));
  }

  render() {
    const { selected } = this.state;
    const cloneablePropertiesLength = Object.keys(this.cloneableProperties).length;
    const footer = (
      <div className={css.modalFooter}>
        <Button
          buttonStyle="default"
          id="duplicate-agreement-modal-cancel-button"
          onClick={this.props.onClose}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
        <Button
          buttonStyle="primary"
          disabled={isEmpty(selected) || Object.values(selected).every(item => item === false)}
          id="duplicate-agreement-modal-save-button"
          onClick={() => this.props.onClone(pickBy(selected))}
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </div>
    );

    return (
      <Modal
        dismissible
        footer={footer}
        id="duplicate-agreement"
        label={<FormattedMessage id="ui-agreements.duplicateAgreement" />}
        onClose={this.props.onClose}
        open
        size="small"
      >
        <div className={css.message}>
          <FormattedMessage id="ui-agreements.duplicateAgreementModal.message" />
        </div>
        <div className={css.selectAll}>
          <Checkbox
            checked={Object.keys(selected).length === cloneablePropertiesLength && Object.values(selected).includes(false) !== true}
            label={<FormattedMessage id="ui-agreements.selectAll" />}
            onChange={this.toggleSelectAll}
            value="selectAll"
          />
        </div>
        {Object.entries(this.cloneableProperties).map(([prop, value], index) => {
          return (
            <Checkbox
              checked={this.state.selected[prop]}
              key={index}
              label={value}
              name={prop}
              onChange={this.updateSelection}
              value={prop}
            />
          );
        })
        }
      </Modal>
    );
  }
}
