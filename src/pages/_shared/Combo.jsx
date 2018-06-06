import React from "react";

export default class Combo extends React.Component {
    constructor(props) {
        super(props);

        if(props.onChange)
            this.onChange = props.onChange.bind(this);
        else
            this.onChange = this.onChange.bind(this);
    }

    onChange() { }

    render() {
        var itens = [];

        var incremento = 1;
        var max = parseFloat(this.props.max);

        if(this.props.incremento)
            incremento = this.props.incremento;

        for(var i = this.props.min; i <= max; i = parseFloat((i + incremento).toFixed(2)))
        {
            if(this.props.decimais)
                itens.push(i.toFixed(2));
            else
                itens.push(i);
        }

        if(this.props.comboTempoSobrevivencia) {
            return (
                <select className="form-control" id={this.props.id} name={this.props.id} onChange={this.onChange} value={this.props.value} defaultValue={5}> 
                    <option value="0">0</option>
                    {
                        itens.map((item, index) => <option key={index} value={item}>{this.props.decimais ? item.replace('.', ',') : item}</option>)
                    }
                </select>
            );
        } else {
            return (
                <select className="form-control" id={this.props.id} name={this.props.id} onChange={this.onChange} value={this.props.value} disabled={this.props.comboDesativado}>
                    {
                        itens.map((item, index) => <option key={index} value={item}>{this.props.decimais ? item.replace('.', ',') : item}</option>)
                    }
                </select>
            );
        }
    }
}
