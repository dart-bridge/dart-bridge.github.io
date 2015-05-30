import React from 'react';
import Request from 'xhr-promise';

class Page extends React.Component {

    constructor(attributes) {
        super(attributes);
        this.state = {
            page: ''
        };
    }

    componentDidMount() {
        new Request().send({
            method: 'GET',
            url: `/.build/${this.props.page}.html`
        }).then((res) => {
            if (res.status !== 200)
                throw new Error(`Error: ${res.status}`);

            this.setState({
                page: res.responseText
            })
        }).catch((e) => {
            console.error(e.message);
        })
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.page}}>

            </div>
        );
    }
}

export default Page;