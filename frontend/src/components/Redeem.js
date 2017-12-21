
		this.state = {
			amount: '',
			LNKSExchange: null,
			success: '',
			failure: ''
		}

	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({amount: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		this.props.LNKSExchange.deployed().then(exchange => {
			console.log("Exchange address:", exchange.address);

			exchange.redeem(this.state.amount*1000, {
				from: this.props.account,
				gas: 150000
			}).then(receipt => {
				console.log('receipt', receipt);

				this.setState({success: `Success! Transaction hash - ${receipt.tx}`});
			}).catch(error => {
				this.setState({failure: error.message});
			});
		});
	}

	render() {
		return (
			<div id="redeem" className="col-xs-6 col-md-6">
				<h4><font color="#AAABAD"><center>Redeem Tokens</center></font></h4>

				<p style={{color: "green"}}>{this.state.success ? this.state.success : null}</p>
				<p style={{color: "red"}}>{this.state.failure ? this.state.failure : null}</p>

				<Form onSubmit={this.handleSubmit}>
					<FormItem>
			        	<Input type="number" onChange={this.handleChange} value={this.state.amount} placeholder="Amount to redeem" />
					</FormItem>

					<Button type="primary" htmlType="submit">Redeem tokens</Button>
				</Form>
			</div>
		);
	}
};


function mapStateToProps(state) {
  return {
    LNKSExchange: state.LNKSExchange,
    account: state.account,
    web3: state.web3
  }
}

export default connect(mapStateToProps)(Redeem);
