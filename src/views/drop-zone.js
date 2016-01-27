import React from 'react';

class DropZone extends React.Component {
    state = {
        isDragActive: false,
        isDragReject: false
    };

    onDragEnter(evt) {
        let files = [],
            allFilesAccepted = false;

        evt.preventDefault();

        ++this.enterCounter;

        if (evt.dataTransfer && evt.dataTransfer.items) {
            files = Array.prototype.slice.call(files);
        }

        if (
            files.length === 1 &&
            files[0].type.match('image.*') &&
            (
                typeof this.props.accept !== 'function' ||
                this.props.accept(files[0])
            )
        ) {
            allFilesAccepted = true;
        }

        this.setState({
            isDragActive: allFilesAccepted,
            isDragReject: !allFilesAccepted
        });
    }

    onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    }

    onDragLeave(evt) {
        evt.preventDefault();

        if (--this.enterCounter > 0) {
            return;
        }

        this.setState({
            isDragActive: false,
            isDragReject: false
        });
    }

    onDrop(evt) {
        evt.preventDefault();

        this.enterCounter = 0;

        this.setState({
            isDragActive: false,
            isDragReject: false
        });

        if (typeof this.props.onDrop === 'function') {
            this.props.onDrop(evt);
        }
    }

    render() {
        let drop;

        if (this.state.isDragActive) {
            drop = this.props.dropIcon || <div className="drop-icon"></div>;
        }

        return (
            <div className="drop-zone"
                onDragEnter={ this.onDragEnter.bind(this) }
                onDragOver={ this.onDragOver.bind(this) }
                onDragLeave={ this.onDragLeave.bind(this) }
                onDrop={ this.onDrop.bind(this) } >
                { drop }
            </div>
        );
    }
}

export default DropZone;
