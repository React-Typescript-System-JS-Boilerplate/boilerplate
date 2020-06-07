import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { BaseWidget, BaseWidgetProps } from "../../common/BaseWidget";


const inputClasses = {
	text: "epos-details-text-input",
	checkbox: "epos-check-input",
	password: "epos-details-text-input",
	date: "epos-details-text-input epos-details-date",
	datetext: "epos-details-text-input epos-details-date",
	currency: "epos-details-text-input epos-details-currency",
	numeric: "epos-details-text-input epos-details-numeric",
	identityNo: "epos-details-text-input",
};

export const CHARACTERS_NUMERIC = /[0-9]/g;
export const CHARACTERS_ALPHA = /[A-Za-z]/g;
export const CHARACTERS_DATE = /[0-9-]/g;
export const IDENTITY_NUMBER_CHECK = /(\d{2}(0[13578]|1[02])31)-(\d{2})-(\d{4})|(\d{2}(01|0[3-9]|1[0-2])(29|30))-(\d{2})-(\d{4})|(\d{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-8]))-(\d{2})-(\d{4})|((((04|08|[2468][048]|[13579][26])))(02)29)-(\d{2})-(\d{4})/g;

export const conversionToComma = (item) => {
	return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const removeCommas = (value) => {
	return value.replace(/,/g, '');
}


export interface EposDetailsTextInputProps extends BaseWidgetProps {
	classList?: string[];
	onChange?: any;
	onBlur?: any;
	onValueChange?: (
		value: string | number | boolean,
		info?: object,
		event?: React.FormEvent<HTMLInputElement>,
		errorInfo?: any
	) => void;
	label: string;
	type: string;
	placeholder?: string;
	id?: string;
	key?: string | number;
	secondLabel?: string;
	maxLength?: number;
	required?: any;
	error?: boolean;
	errorText?: string;
	value?: string | number | boolean;
	info?: object;
	currencySymbol?: string;
	prefix?: string;
	min?: string | number;
	max?: string | number;
	disabled?: boolean;
	allowedRegex?: string | RegExp;
	allowedRegexMessage?: string;
	maxDate?: string;
	minDate?: string;
	dateErrorMessage?: string;
	minAndmaxErrorMessage?: string;
	requiredMessage?: string;
	dateValidErrorMessage?: string;
	dependentValue?: string;
}

export interface EposDetailsTextInputState {
	value?: string | number | boolean;
	propsValueReceived?: boolean;
	currencyError?: boolean;
	currencyErrorMessage?: string;
	currencyOnFocus?: boolean;
	allowedRegexError?: boolean;
	dateError?: boolean;
	minAndmaxError?: boolean;
	isRequired?: boolean;
	dateValidError?: boolean;
}
interface customHTMLElement extends Element {
	selectionStart: number;
}
export class EposDetailsTextInputElement extends BaseWidget<EposDetailsTextInputProps, EposDetailsTextInputState> {
	static defaultProps = {
		id: "details-text-input"
	};
	constructor(props: EposDetailsTextInputProps) {
		super("details-textinput-element", props);

		this.state = {
			value: this.props.value ? this.props.value : "",
			currencyError: false,
			currencyOnFocus: false,
			currencyErrorMessage: "Only numbers are allowed",
			allowedRegexError: false,
			dateError: false,
			minAndmaxError: false,
			isRequired: false,
			dateValidError: false,
			isZeroError:false,
			isZeroMessage:"Please type valid number"
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			propsValueReceived: true
		});
		if (this.props.dependentValue !== nextProps.dependentValue) {
			this.setState({
				value: "",
				dateError: false,
				allowedRegexError: false,
				propsValueReceived: false,
				isRequired: false,
				dateValidError: false
			});
		}
	}

	onClick = (event: any) => {
		let { type, currencySymbol, value } = this.props;
		let input = this.refs.input as customHTMLElement;
		if (type === 'numeric') {
			let minCaret = 0;
			if (currencySymbol)
				minCaret = currencySymbol.length + 4;

			if (input.selectionStart < minCaret) {
				input.selectionStart = minCaret;
			}
		}
	}

	prefixRemovalFromValue = value => {
		let { prefix, type } = this.props;
		let labelOnType = "  " + ((prefix) ? prefix : '') + "  ";
		let labelOnBackspace = "  " + ((prefix) ? prefix : '') + " ";
		if (type == "numeric") {
			if (value.indexOf(labelOnType) > -1)
				value = value.replace(labelOnType, "");
			else if (value.indexOf(labelOnBackspace) > -1)
				value = value.replace(labelOnBackspace, "");
		}
		return value;
	};
	setValue(value) {
		this.setState({
			value,
			dateError: false,
			allowedRegexError: false,
			propsValueReceived: false,
			minAndmaxError: false,
			isRequired: false,
			dateValidError: false
		});
	}

	parseRegex(value, required) {
		let { allowedRegex } = this.props;
		if (allowedRegex) {
			let matchingRegex: RegExp;
			if (allowedRegex instanceof RegExp) {
				matchingRegex = allowedRegex;
			} else if (typeof allowedRegex === 'string') {
				matchingRegex = new RegExp(allowedRegex, "g");
			}

			if (value && value.length) {
				let patternMatchedLength = (value.match(matchingRegex)) ? value.match(matchingRegex).length : 0;
				let valueLength = value.length;
				if (patternMatchedLength == valueLength) {
					this.setValue(value);
				}
				else {
					this.setState({
						allowedRegexError: true
					})
				}
			} else if (value.length === 0) {
				this.setState({
					value,
					isRequired: required,
					propsValueReceived: false
				})
			} else {
				this.setValue(value);
			}
		} else if (value.length === 0) {
			this.setState({
				value,
				isRequired: required,
				propsValueReceived: false
			})
		} else {
			this.setValue(value);
		}
	}

	parseDate(value, required) {
	
		let { maxDate } = this.props;
		let { minDate } = this.props;

		if (maxDate && value && value.length == 10) {
			let diff = moment(moment(maxDate, 'DD-MM-YYYY'))
				.diff(moment(value, 'DD-MM-YYYY'), 'days');
			let diffMin = moment(moment(minDate, 'DD-MM-YYYY'))
				.diff(moment(value, 'DD-MM-YYYY'), 'years');
			
			let diffMinDays=moment(moment(minDate, 'DD-MM-YYYY'))
			.diff(moment(value, 'DD-MM-YYYY'), 'days');

			if ((diff >= 0 && diffMin <= 100)&&diffMinDays<=0) {
				this.setState({
					value,
					dateError: false,
					propsValueReceived: false,
					isRequired: false,
					dateValidError: false
				});
			} else {
				this.setState({
					value,
					dateValidError: true,
					propsValueReceived: false,
					isRequired: false
				});
			}
		}
		else if (value.length === 0) {
			this.setState({
				value,
				isRequired: required,
				propsValueReceived: false
			})
		} else {
			let patternMatchedLength = (value.match(CHARACTERS_DATE)) ? value.match(CHARACTERS_DATE).length : 0;
			let valueLength = value.length;
			if (patternMatchedLength == valueLength) {
				this.setValue(value);
			}
			else {
				this.setState({
					value,
					dateError: true
				})
			}
		}
	}

	parseIdentityNo(value, required) {
		let isIdentityNo = value.match(IDENTITY_NUMBER_CHECK) !== null;
		if (value && value.length == 14) {
			if (isIdentityNo) {
				let dob = value.substring(0, 6);
				let year = dob.substring(0, 2);
				let month = dob.substring(2, 4);
				let day = dob.substring(4, 6);
				let currentYY = new Date().toLocaleDateString('en', { year: '2-digit' });
				if (year <= currentYY) {
					year = 20 + year;
				} else {
					year = 19 + year;
				}
				dob = year + '-' + month + '-' + day;
				let currentDate = new Date();
				dob = new Date(dob);
				let isCurrentDate = currentDate.toDateString() == dob.toDateString();
				if (currentDate < dob || isCurrentDate) {
					this.setState({
						value,
						allowedRegexError: true,
						isRequired: required,
						propsValueReceived: false
					})
				} else {
					this.setValue(value);
				}
			} else {
				this.setState({
					value,
					allowedRegexError: true,
					isRequired: required,
					propsValueReceived: false
				})
			}
		} else if (value.toString().length === 0) {
			this.setState({
				value,
				isRequired: required,
				allowedRegexError: false,
				propsValueReceived: false
			})
		} else if (value.match(CHARACTERS_ALPHA) !== null) {
			this.setState({
				value,
				allowedRegexError: true
			})
		} else {
			this.setValue(value);
		}
	}

	parseMinandMaxRange(value: string) {
		const { min, max } = this.props;
		const targetvalue = this.props.value;
		if(parseInt(value)==0){
			alert(value)
			this.setState({
				targetvalue,
				minAndmaxError: true
			})

		}
	
		if (parseInt(value) < min) {
			this.setState({
				targetvalue,
				minAndmaxError: true
			})
		} else if (parseInt(value) > max) {
			this.setState({
				targetvalue,
				minAndmaxError: true
			})
		}
	}


	onChange = event => {
		let { onChange, type, maxLength, min, max, allowedRegexMessage, required } = this.props;
		onChange && onChange(event);
		if (type == 'numeric') {
			let value = this.prefixRemovalFromValue(event.target.value);
			if (!isNaN(value)) {
				this.parseRegex(value, required);
			}
		} else if (type == 'currency') {
			let value = event.target.value;
			value = removeCommas(value);
			if (value.length > maxLength)
				value = value.slice(0, 10)
			this.parseRegex(removeCommas(value), required);
		} else if (type == 'datetext') {
			let value = event.target.value;
			this.parseDate(value, required);
		} else if (type == 'identityNo' && allowedRegexMessage) {
			let value = event.target.value;
			if (value.length > 2) {
				value = value.split('-').join('');
				value = value.match(/.{1,6}/g).join('-');
				value = value.match(/.{1,9}/g).join('-');
			}
			this.parseIdentityNo(value, required);
		} else {
			let value = event.target.value;
			this.parseRegex(value, required);
		}
	};

	onBlur = e => {
		let { onBlur, onValueChange, type, info, min, max, required } = this.props;
		onBlur && onBlur(e);
		if (type == 'numeric' || type == 'currency') {
			let targetValue = e.target.value;
			if (type == 'currency') {
				targetValue = removeCommas(targetValue);
			}
			targetValue = (type == 'numeric') ? this.prefixRemovalFromValue(targetValue) : targetValue;
			if (isNaN(targetValue) || targetValue == "") {
				this.setState({
					currencyError: targetValue != "" ? true : false,
					currencyOnFocus: false,
					value: targetValue
				});
				if (targetValue == '')
					onValueChange && onValueChange(targetValue, info, e);
				else
					onValueChange && onValueChange(this.props.value, info, e);
			}
			if(targetValue==0){
				this.setState({
					value:undefined,
					isRequired:true
				})
			}
			 else {
				this.setState({
					currencyError: false,
					currencyOnFocus: false
				});
				const isValid = (!isNaN(targetValue) && (min && min > parseInt(targetValue)) || (max && parseInt(targetValue) > max));
				if (isValid) {
					this.parseMinandMaxRange(targetValue);
				} else {
					onValueChange && onValueChange(parseInt(targetValue), info, e);
				}
			}
		} else if (type == 'datetext') {
			let value = e.target.value;
			if (value.length == 10) {
				onValueChange && onValueChange(e.target.value, info, e, this.state.dateError);
			} else if (value.length === 0) {
				this.setState({
					value,
					isRequired: required,
					allowedRegexError: false,
					propsValueReceived: false,
					dateError: false,
					dateValidError: false
				})
				onValueChange && onValueChange(e.target.value, info, e);
			} else {
				this.setState({
					value,
					dateValidError: true
				});
				onValueChange && onValueChange(e.target.value, info, e, this.state.dateError);
			}
		} else if (type == 'identityNo') {
			let value = e.target.value;
			let isIdentityNo = value.match(IDENTITY_NUMBER_CHECK) !== null;
			let dob = value.substring(0, 6);
			let year = dob.substring(0, 2);
			let month = dob.substring(2, 4);
			let day = dob.substring(4, 6);
			let currentYY = new Date().toLocaleDateString('en', { year: '2-digit' });
			if (year <= currentYY) {
				year = 20 + year;
			} else {
				year = 19 + year;
			}
			dob = year + '-' + month + '-' + day;
			let currentDate = new Date();
			dob = new Date(dob);
			let isCurrentDate = currentDate.toDateString() == dob.toDateString();
			let isFutureDate = currentDate.getTime() <= new Date(dob).getTime();
			if (isCurrentDate || isFutureDate) {
				this.setState({
					value,
					allowedRegexError: true
				})
			} else if (isIdentityNo) {
				this.setState({
					value,
					isRequired: false,
					dateError: false,
					dateValidError: false,
					allowedRegexError: false,
					propsValueReceived: false,
				})
				onValueChange && onValueChange(e.target.value, info, e);
			} else if (value.length === 0) {
				this.setState({
					value,
					isRequired: required,
					allowedRegexError: false,
					propsValueReceived: false,
				})
				onValueChange && onValueChange(e.target.value, info, e);
			} else {
				this.setState({
					value,
					allowedRegexError: true
				})
			}
		}
		else {
			let value = e.target.value;
			const isValid = (!isNaN(value) && (min && min > parseInt(value)) || (max && parseInt(value) > max));
			if (isValid) {
				this.parseMinandMaxRange(value);
			} else if (required && value.length === 0) {
				this.setState({
					value,
					isRequired: required,
					allowedRegexError: false,
					propsValueReceived: false
				})
				onValueChange && onValueChange(value, info, e);
			} else {
				this.setState({
					isRequired: false,
					allowedRegexError: false,
					propsValueReceived: false
				})
				onValueChange && onValueChange(value, info, e);
			}
		}
	};

	onFocus = (event: React.FormEvent<HTMLInputElement>) => {
		let { type } = this.props;
		if (type == "currency") {
			this.setState({
				currencyOnFocus: true
			});
		}
	};

	calendarIcon = () => {
		return (
			<span className="calendar">
				<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
					<path fill="#838383" d="M10.048 1.165h-.295V.87c0-.489-.396-.885-.884-.885-.489 0-.885.396-.885.885v.295h-1.18V.87c0-.489-.395-.885-.884-.885-.488 0-.884.396-.884.885v.295H3.818V.87c0-.489-.396-.885-.884-.885-.489 0-.885.396-.885.885v.295h-.295c-.488 0-.884.396-.884.884v7.115c0 .488.396.884.884.884h8.296c.489 0 .884-.396.885-.884V2.049c0-.235-.094-.46-.26-.626-.167-.165-.392-.258-.627-.258zM8.574.87c0-.163.132-.295.295-.295.163 0 .295.132.295.295v1.18c0 .162-.132.294-.295.294-.163 0-.295-.132-.295-.295V.87zm-2.949 0c0-.163.132-.295.295-.295.163 0 .295.132.295.295v1.18c0 .162-.132.294-.295.294-.163 0-.295-.132-.295-.295V.87zm-2.987 0c0-.163.132-.295.295-.295.163 0 .295.132.295.295v1.18c0 .162-.132.294-.295.294-.163 0-.295-.132-.295-.295V.87zm7.705 8.296c0 .163-.133.294-.295.295H1.754c-.162 0-.294-.132-.295-.295V4.152h8.884v5.014zm0-5.602H1.459V2.05c0-.162.133-.294.295-.295h.295v.295c0 .489.396.885.885.885.488 0 .884-.396.884-.885v-.295h1.219v.295c0 .489.396.885.884.885.489 0 .885-.396.885-.885v-.295h1.18v.295c0 .489.395.885.884.885.488 0 .884-.396.884-.885v-.295h.295c.163 0 .295.133.295.295l-.001 1.515z" />
				</svg>
			</span>
		)
	}
	addCurrencySymbol = () => {
		let { currencySymbol } = this.props;
		return (
			<span className="currency-symbol">{currencySymbol ? currencySymbol : ''}</span>
		)
	}

	convertDate(value) {
		let dateSplitters = value.split('-');


		if (dateSplitters.length == 3 && dateSplitters[2].length) {
			return value
		}

		if (value.indexOf('-') != 2 && value.indexOf('-') == 1 && dateSplitters.length == 2) {
			dateSplitters[0] = '0' + dateSplitters[0] + '';
			value = dateSplitters.join('-');
		}
		if (value.indexOf('-') != 5 && value.lastIndexOf('-') == 4 && dateSplitters.length == 3) {

			dateSplitters[1] = '0' + dateSplitters[1] + '';
			value = dateSplitters.join('-');
		}

		if (dateSplitters[0] && dateSplitters[0].length > 2) {
			let date = dateSplitters[0];
			dateSplitters[0] = date.slice(0, 2);
			if (dateSplitters[1]) {
				dateSplitters[1] = date.slice(2, 3);
			} else {
				dateSplitters.push(date.slice(2, 3));
			}
			value = dateSplitters.join('-');
		}

		if (dateSplitters[1] && dateSplitters[1].length > 2) {
			let date = dateSplitters[1];
			dateSplitters[1] = date.slice(0, 2);
			if (dateSplitters[2]) {
				dateSplitters[2] = date.slice(2, 3);
			} else {
				dateSplitters.push(date.slice(2, 3));
			}
			value = dateSplitters.join('-');
		}

		return value;
	}

	render() {
		let {
			type,
			label,
			placeholder,
			classList,
			id,
			key,
			info,
			error,
			errorText,
			onBlur,
			onValueChange,
			maxLength,
			required,
			secondLabel,
			currencySymbol,
			prefix,
			min,
			max,
			disabled,
			allowedRegexMessage,
			dateErrorMessage,
			minAndmaxErrorMessage,
			requiredMessage,
			dateValidErrorMessage,
		} = this.props;

		let { currencyOnFocus, allowedRegexError, dateError, minAndmaxError, isRequired, dateValidError } = this.state;
		let finalClassList = ["epos-elements"];

		let tooltiptext = "";

		/* Allowed Regex Message */
		let allowedRegexErrorStatus = (allowedRegexError && allowedRegexMessage);
		let minAndMaxStatus = (minAndmaxError && minAndmaxErrorMessage);
		let requiredStatus = (isRequired && requiredMessage)
		if (type == "currency" && this.state.currencyError) {
			tooltiptext = this.state.currencyErrorMessage;
		} else if (dateError) {
			tooltiptext = dateErrorMessage;
		} else if (dateValidError) {
			tooltiptext = dateValidErrorMessage;
		} else if (allowedRegexErrorStatus) {
			tooltiptext = allowedRegexMessage;
		}
		else if (minAndMaxStatus) {
			tooltiptext = minAndmaxErrorMessage;
		}
		else if (requiredStatus) {
			tooltiptext = requiredMessage;
		}
		else if (error) {
			tooltiptext = errorText ? errorText : tooltiptext;
		}


		finalClassList = [...finalClassList, inputClasses[type]];
		if (classList && classList.length) {
			finalClassList = [...finalClassList, ...classList];
		}
		let inputClass = [];
		let currencySymbolErrorClass = "";

		switch (type) {
			case "checkbox":
				inputClass.push("check-input");
				break;
			case "currency":
				inputClass.push("currency-input");
				if (currencySymbol && currencySymbol.length)
					inputClass.push("currency-symbol-attached");
				break;
			default:
				break;
		}
		let errorMessageStatus = (error || allowedRegexErrorStatus || this.state.currencyError || dateError || minAndmaxError || isRequired || dateValidError);
		if (errorMessageStatus) {
			inputClass.push("text-input-error");
			currencySymbolErrorClass = "currency-symbol-error";
		}
		if (key) {
			id = id + "_" + key;
		}



		/* Conflicting Receive of props */
		let value: string | number;
		if (this.state.propsValueReceived) {
			value = (this.props.value || this.props.value == 0) ? this.props.value + "" : "";
		} else {
			value = (this.state.value || this.props.value == 0) ? this.state.value + "" : "";
		}



		let updatedMaxLength = 999;
		if (maxLength)
			updatedMaxLength = maxLength;



		if (type == "numeric" && prefix && prefix.length) {
			updatedMaxLength = maxLength + (prefix ? prefix.length + 4 : 0)
			if (value) {
				value = "  " + prefix + "  " + value;
			}
		}

		if (type == "currency") {
			value = conversionToComma(value);
			updatedMaxLength = updatedMaxLength + 2;
		}

		if (type == 'datetext') {
			updatedMaxLength = 10;
			value = this.convertDate(value);
		}





		return (
			<div key={key} id={id} className={finalClassList.join(" ")}>
				{type === "checkbox" ? (
					<label id={id + "_label"} className="checkbox-label">
						{label}
					</label>
				) : (
						<label id={id + "_label"} key={key}>
							<span className="label-text">
								{label}
								{
									required &&
									<span className="required">*</span>
								}
							</span>

						</label>
					)}
				<span style={disabled ? { pointerEvents: "none" } : {}} className="relative-position">
					{(type.indexOf('date') > -1) && this.calendarIcon()}
					{(type == 'currency') && this.addCurrencySymbol()}
					<input
						id={id + "_input"}
						ref="input"
						type={type}
						className={inputClass.join(" ")}
						placeholder={placeholder}
						onClick={this.onClick}
						onChange={this.onChange}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						maxLength={updatedMaxLength || 999}
						required={required}
						disabled={disabled}
						value={value}
						min={min}
						max={max}
					/>
				</span>
				{/* To Do */}
				{errorMessageStatus ? (
					<div className="error-container">
						<span className="error-icon" aria-label={tooltiptext}>
							<svg viewBox="0 0 27 27">
								<g fill="#ED3E44" fillRule="evenodd">
									<path d="M13.5 27C20.956 27 27 20.956 27 13.5S20.956 0 13.5 0 0 6.044 0 13.5 6.044 27 13.5 27zm0-2C7.15 25 2 19.85 2 13.5S7.15 2 13.5 2 25 7.15 25 13.5 19.85 25 13.5 25z" />
									<path d="M12.05 7.64c0-.228.04-.423.12-.585.077-.163.185-.295.32-.397.138-.102.298-.177.48-.227.184-.048.383-.073.598-.073.203 0 .398.025.584.074.186.05.35.126.488.228.14.102.252.234.336.397.084.162.127.357.127.584 0 .22-.043.412-.127.574-.084.163-.196.297-.336.4-.14.106-.302.185-.488.237-.186.053-.38.08-.584.08-.215 0-.414-.027-.597-.08-.182-.05-.342-.13-.48-.235-.135-.104-.243-.238-.32-.4-.08-.163-.12-.355-.12-.576zm-1.02 11.517c.134 0 .275-.013.424-.04.148-.025.284-.08.41-.16.124-.082.23-.198.313-.35.085-.15.127-.354.127-.61v-5.423c0-.238-.042-.43-.127-.57-.084-.144-.19-.254-.318-.332-.13-.08-.267-.13-.415-.153-.148-.024-.286-.036-.414-.036h-.21v-.95h4.195v7.463c0 .256.043.46.127.61.084.152.19.268.314.35.125.08.263.135.414.16.15.027.29.04.418.04h.21v.95H10.82v-.95h.21z" />
								</g>
							</svg>
						</span>
					</div>
				) : (
						""
					)}

				{secondLabel && (
					<label className="second-label">{secondLabel}</label>
				)}
			</div>
		);
	}
}
