import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }

    //When the output is inserted in the DOM, React calls the componentDidMount() lifecycle method.     
    componentDidMount() {
      fetch('http://localhost:5000/checkToken', {
        method: 'POST',
        body: JSON.stringify({ token: localStorage.getItem('token') }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.text())
        .then(res => {
          console.log(res)
          if (res === 'OK') {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }

    //Transforms the components into DOM node that the 
    // browser can understand and display to the screen.
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/login" />;
      }
      return (
        <>
          <ComponentToProtect {...this.props} />
        </>
      );
    }
  }
}