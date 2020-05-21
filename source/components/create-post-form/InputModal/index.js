import React, { Fragment } from 'react'
import withToggle from 'constructicon/with-toggle'
import { formatFileSize } from 'constructicon/lib/files'

import Button from 'constructicon/button'
import Card from 'constructicon/leaderboard-item'
import Icon from 'constructicon/icon'
import Modal from 'constructicon/modal'

const InputModal = ({
  buttonProps,
  cardProps,
  children,
  data,
  onToggle,
  onToggleOff,
  toggled,
  type,
  width
}) => {
  const cardData = () => {
    switch (type) {
      case 'video':
        return {
          image: data.thumbnail_url,
          subtitle: [data.author_name, data.provider_name].join(' - '),
          title: data.title
        }
      default:
        return {
          image: data.preview,
          subtitle: formatFileSize(data.size),
          title: data.name
        }
    }
  }

  return (
    <Fragment>
      {data ? (
        <Button {...buttonProps} block spacing={0.25} onClick={onToggle}>
          <Card {...cardProps} {...cardData()} />
        </Button>
      ) : (
        <Button
          {...buttonProps}
          block
          spacing={0.5}
          onClick={onToggle}
          background='transparent'
          borderColor='primary'
          borderWidth={2}
          foreground='primary'
        >
          <Icon name={type} />
          <span>{`Add ${type === 'image' ? 'an' : 'a'} ${type}`}</span>
        </Button>
      )}
      <Modal
        width={width}
        isOpen={toggled}
        contentLabel={`Add ${type} to post`}
        onRequestClose={onToggleOff}
      >
        {children}
        <Button {...buttonProps} block onClick={onToggleOff}>
          {data ? `Add ${type} to post` : 'Cancel'}
        </Button>
      </Modal>
    </Fragment>
  )
}

InputModal.defaultProps = {
  cardProps: {
    avatarRadius: 'medium',
    linkTag: 'div',
    tag: 'div',
    margin: 0,
    spacing: 0
  },
  width: 16
}

export default withToggle(InputModal)
