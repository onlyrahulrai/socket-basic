import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import io from "socket.io-client";

let socket = io.connect("http://127.0.0.1:5000");

const Editor = () => {
  const [text, setText] = useState("");

  const onChange = (e) => {
    setText(e.target.value);

    socket.emit("on_change_text", e.target.value);
  };

  useEffect(() => {
    socket.on("on_editor_connected", (text) => {
      setText(text)
    });
  }, [socket]);

  const onSubmit = (e) => {
    e.preventDefault();


  };

  return (
    <div className="container p-5">
      <Row className="justify-content-center">
        <Col md="8">
          <h3 className="text-center">Live Editor</h3>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="exampleText">Text Area</Label>
              <Input
                id="exampleText"
                name="text"
                type="textarea"
                placeholder="Write something here..."
                rows="20"
                cols="30"
                onChange={onChange}
                value={text}
              />
            </FormGroup>

            <Button color="warning" type="submit" className="text-white">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Editor;
