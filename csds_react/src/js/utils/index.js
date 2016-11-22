import React from "react";
import "whatwg-fetch";
import {polyfill} from "es6-promise";

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function buildHeaders() {
    const csrfToken = getCookie('csrftoken');

    return new Headers({...defaultHeaders, 'X-CSRFToken': csrfToken});
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export function parseJSON(response) {
    if ([200, 201].includes(response.status))
        return response.json();
    else
        return response;
}

export function httpGet(url) {

    return fetch(url, {
        headers: buildHeaders(),
        credentials: 'same-origin',
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function httpPost(url, data) {
    const body = JSON.stringify(data);

    return fetch(url, {
        method: 'POST',
        headers: buildHeaders(),
        credentials: 'same-origin',
        body: body,
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function httpRequest(url, method, data) {
    const body = JSON.stringify(data);

    return fetch(url, {
        method: method,
        headers: buildHeaders(),
        credentials: 'same-origin',
        body: body,
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function httpDelete(url) {

    return fetch(url, {
        method: 'DELETE',
        headers: buildHeaders(),
        credentials: 'same-origin',
    })
        .then(checkStatus)
        .then(parseJSON);
}

export function setDocumentTitle(title) {
    document.title = `${title} | CSDSProject`;
}

export function renderErrorsFor(errors, ref) {
    if (!errors) return false;

    return errors.map((error, i) => {
        if (error[ref]) {
            return (
                <div key={i} className="error">
                    {error[ref]}
                </div>
            );
        }
    });
}
