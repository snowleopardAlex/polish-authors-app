import React from "react";
import axios from "axios";
import { Input, Table, FormGroup, Label, Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";


class App extends React.Component {
  state = {
    polishAuthors: [],
    newAuthorData: {
      author: "",
      greatestWork: "",
      published: ""
    },
    editAuthorData: {
      id: "",
      author: "",
      greatestWork: "",
      published: ""
    },
    newAuthorModal: false,
    editAuthorModal: false
  }

  // lifecycle method hook - tiggers before the initial render, and the function will
  // only trigger once in the lifespan of a component. It is used to update the state value before the DOM is rendered. 
    
  // GET
  componentDidMount() {
   this._refreshAuthors();
  }

  _refreshAuthors() {
      axios.get('http://localhost:3000/polishAuthors').then((response) => {
        this.setState({
          polishAuthors: response.data
        })
      });
     }


  // MODAL
   handleShowAuthorModal() {
     this.setState ({
       newAuthorModal: !this.state.newAuthorModal
     })
   }

  handleEditAuthorModal() {
    this.setState({
       editAuthorModal: !this.state.editAuthorModal
    })
  }


  // POST
   addAuthor() {
     axios.post('http://localhost:3000/polishAuthors', this.state.newAuthorData)
     .then((response) => {
      // call authors from the state
      let { polishAuthors } = this.state;
      // push new authors 
      polishAuthors.push(response.data);
      // reset the state with the current authors
      // hide modal window
      // reset a new author data 
      this.setState({ polishAuthors, newAuthorModal: false, newAuthorData: {
        author: "",
        greatestWork: "",
        published: ""
      }});
     });
   }

   // UPDATE AUTHOR
   updateAuthor() {
    let { author, greatestWork, published} = this.state.editAuthorData;

    axios.put('http://localhost:3000/polishAuthors/' + this.state.editAuthorData.id, {
      author, greatestWork, published
    }).then((response) => {
    // replace with new author old data
       this._refreshAuthors();

       // after updating edit author, the modal goes off and the updated data is displayed
       this.setState({
         editAuthorModal: false, editAuthorData: { id:"", author:"", greatestWork:"", published:"" }
       })
    });
   }

   // EDIT AUTHOR
   editAuthor(id, author, greatestWork, published) {
      this.setState({
        editAuthorData: 
        { id, author, greatestWork, published }, editAuthorModal: !this.state.editAuthorModal
      });
   }

  // DELETE AUTHOR
   deleteAuthor(id) {
     axios.delete('http://localhost:3000/polishAuthors/' + id).then((response) => {
       this._refreshAuthors();
     });
   }

  render () {

    let polishAuthors = this.state.polishAuthors.map((polishAuthor) => {
      return (
      <tr key={polishAuthor.id}>
      <td>{polishAuthor.author}</td>
      <td>{polishAuthor.greatestWork}</td>
      <td>{polishAuthor.published}</td>
      <td>
        <Button 
          color="success" 
          size="sm" 
          className="mr-2" 
          onClick={this.editAuthor.bind(this, polishAuthor.id, polishAuthor.author, polishAuthor.greatestWork, polishAuthor.published)}>
          Edit
        </Button>
        <Button 
          color="danger" 
          size="sm"
          onClick={this.deleteAuthor.bind(this, polishAuthor.id)}>
          Delete
        </Button>
      </td>
    </tr>
      )
    })

    return (
      <div className="App container">
        <h3 className="mt-3 ml-2">Famous Polish Authors</h3>
        <Button color="info" onClick={this.handleShowAuthorModal.bind(this)} className="ml-2">Add Author</Button>
      
      <Modal isOpen={this.state.newAuthorModal} toggle={this.handleShowAuthorModal.bind(this)}>
        <ModalHeader toggle={this.handleShowAuthorModal.bind(this)}>Add a new author</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="author">Author</Label>
            <Input id="author" value={this.state.newAuthorData.author} onChange={(e) => {

              let {newAuthorData} = this.state;

              newAuthorData.author = e.target.value;

              this.setState({ newAuthorData });

              }} 
            />
          </FormGroup>
          <FormGroup>
            <Label for="greatestWork">Greatest Work</Label>
            <Input id="greatestWork" value={this.state.newAuthorData.greatestWork} onChange={(e) => {

              let {newAuthorData} = this.state;

              newAuthorData.greatestWork = e.target.value;

              this.setState({ newAuthorData });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="published">Published</Label>
            <Input id="published" value={this.state.newAuthorData.published} onChange={(e) => {

              let {newAuthorData} = this.state;

              newAuthorData.published = e.target.value;

              this.setState({ newAuthorData });
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addAuthor.bind(this)}>Add Author</Button>{' '}
          <Button color="danger" onClick={this.handleShowAuthorModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.editAuthorModal} toggle={this.handleEditAuthorModal.bind(this)}>
        <ModalHeader toggle={this.handleEditAuthorModal.bind(this)}>Edit author</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="author">Author</Label>
            <Input id="author" value={this.state.editAuthorData.author} onChange={(e) => {

              let {editAuthorData} = this.state;

              editAuthorData.author = e.target.value;

              this.setState({ editAuthorData });

              }} 
            />
          </FormGroup>
          <FormGroup>
            <Label for="greatestWork">Greatest Work</Label>
            <Input id="greatestWork" value={this.state.editAuthorData.greatestWork} onChange={(e) => {

              let {editAuthorData} = this.state;

              editAuthorData.greatestWork = e.target.value;

              this.setState({ editAuthorData });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="published">Published</Label>
            <Input id="published" value={this.state.editAuthorData.published} onChange={(e) => {

              let {editAuthorData} = this.state;

              editAuthorData.published = e.target.value;

              this.setState({ editAuthorData });
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateAuthor.bind(this)}>Update</Button>{' '}
          <Button color="danger" onClick={this.handleEditAuthorModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

        <Table className="mt-3">
          <thead>
            <tr>
              <th>Polish Author</th>
              <th>Greatest Work</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
  
          <tbody>
            {polishAuthors}
          </tbody>
        </Table>
        </div>
    );
  }
}

export default App;

