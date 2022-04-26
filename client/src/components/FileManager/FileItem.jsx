import React, { useEffect, useState } from 'react';
import { Col, Dropdown } from 'react-bootstrap';

const FileItem = props => {
	const { name, createdDate, size } = props.file;
	const {
		selectedFile,
		setSelectedFile,
		onSelectFile,

		// Update
		onRenameFile,

		// Remove
		onRemoveFile
	} = props;

	const imgUrl = process.env.REACT_APP_SERVER_URL + '/uploads/images/' + name;

	const [isUpdatedFile, setIsUpdatedFile] = useState(false);
	useEffect(() => {
		setNewName(name);
	}, [isUpdatedFile, name]);

	const [newName, setNewName] = useState(name);
	const handleKeyPress = e => {
		if (e.key === 'Enter') {
			onRenameFile(name, newName);
		}
	};
	const handleChangeName = e => {
		setNewName(e.target.value);
	};

	useEffect(() => {
		setIsUpdatedFile(false);
	}, [selectedFile]);

	return (
		<Col xl={3} className="mx-0">
			<div
				role="button"
				style={{ height: '100%' }}
				className={
					'bg-light p-0' +
					(selectedFile === name
						? ' border border-primary'
						: 'border-0')
				}
				onClick={() => setSelectedFile(name)}
				onDoubleClick={() => onSelectFile(imgUrl)}
			>
				<div className="text-center">
					<img
						src={imgUrl}
						height={150}
						style={{ maxWidth: '100%' }}
						alt={name}
					/>
				</div>
				<div className="d-flex">
					<div style={{ width: '95%' }}>
						<div
							style={{
								overflowX: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								fontSize: 13
							}}
							className="p-1"
						>
							{selectedFile === name && isUpdatedFile ? (
								<input
									value={newName}
									onChange={handleChangeName}
									onKeyPress={handleKeyPress}
									className="form-control"
									style={{
										height: 20,
										width: '98%'
									}}
								/>
							) : (
								<span title={name}>{name}</span>
							)}
						</div>
						<div className="p-1 pt-0">
							<div style={{ fontSize: 10 }}>{createdDate}</div>
							<div style={{ fontSize: 10 }}>{size}</div>
						</div>
					</div>
					<div style={{ width: '5%' }}>
						<Dropdown className="nav-item no-arrow pe-1 pt-1">
							<Dropdown.Toggle id="menu-file" as="div">
								<i
									className="fas fa-ellipsis-vertical"
									style={{ width: 10 }}
								/>
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item href={imgUrl} target="_blank">
									<i className="fas fa-eye" /> Xem ảnh
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => setIsUpdatedFile(true)}
								>
									<i className="fas fa-square-pen" /> Đổi tên
								</Dropdown.Item>
								<Dropdown.Item
									onClick={() => onRemoveFile(name)}
								>
									<i className="fas fa-trash" /> Xóa
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</div>
			</div>
		</Col>
	);
};

export default FileItem;
