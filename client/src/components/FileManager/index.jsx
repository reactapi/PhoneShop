import uploadApi from 'api/uploadApi';
import { SplitButton } from 'components/Buttons';
import React, { useEffect, useState } from 'react';
import { Col, FormControl, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FileItem from './FileItem';

export const FileManager = props => {
	const { show, onSelectFile, onClose } = props;

	const [isFileMode, setIsFileMode] = useState(false);
	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const res = await uploadApi.fetchList(
				isFileMode ? 'files' : 'images'
			);

			setFiles(res.data || []);
		};

		fetchFiles();
	}, [isFileMode]);

	const fetchFiles = async () => {
		const res = await uploadApi.fetchList(isFileMode ? 'files' : 'images');

		setFiles(res.data || []);
	};

	// selectedFile
	const [selectedFile, setSelectedFile] = useState('');
	useEffect(() => {
		if (show) setSelectedFile('');
	}, [show]);

	const { setValue, register } = useForm({
		defaultValues: {
			upload: ''
		}
	});

	// Upload
	const handleUploadFile = async e => {
		try {
			const file = e.target.files[0];

			if (file) {
				const res = await uploadApi.upload({
					type: isFileMode ? 'files' : 'images',
					file
				});

				if (res.uploaded) {
					toast.success('Tải hình lên máy chủ thành công!');
					setValue('upload', '');
					fetchFiles();
					setSelectedFile(file.name);
				} else {
					toast.error(res.message);
				}
			}
		} catch (error) {
			toast.error('Tải hình không thành công!');
		}
	};

	// Rename
	const handleRenameFile = async (fileName, newFileName) => {
		try {
			const res = await uploadApi.update({
				type: isFileMode ? 'file' : 'images',
				fileName: fileName,
				newFileName
			});

			if (res.status) {
				toast.success(res.message);
				fetchFiles();
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Đổi tên không thành công!');
		}
	};

	// Remove
	const handleRemoveFile = async fileName => {
		try {
			const res = await uploadApi.remove({
				type: isFileMode ? 'files' : 'images',
				fileName
			});

			if (res.status) {
				toast.success(res.message);
				fetchFiles();
			} else toast.error(res.message);
		} catch (error) {
			toast.error('Xóa ảnh không thành công!');
		}
	};

	return (
		<Modal size="xl" show={show} onHide={onClose}>
			<Modal.Header closeButton className="bg-light">
				<Modal.Title></Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div className="border-bottom p-2 bg-light">
					<form>
						<SplitButton
							as="label"
							htmlFor="upload"
							icon="fas fa-arrow-up-from-bracket"
							text="Tải lên"
						/>
						<FormControl
							type="file"
							id="upload"
							{...register('upload')}
							hidden
							onChange={handleUploadFile}
						/>
					</form>
				</div>
				<Row className="m-0">
					<Col
						xs={3}
						className="border-end px-0 bg-light"
						style={{ borderBottomLeftRadius: 10 }}
					>
						<div>
							<div
								className={
									(!isFileMode ? 'bg-white ' : '') +
									`p-3 border-bottom`
								}
								role="button"
								onClick={() => setIsFileMode(false)}
							>
								Ảnh
							</div>
							<div
								className={
									(isFileMode ? 'bg-white ' : '') +
									`p-3 border-bottom`
								}
								role="button"
								onClick={() => setIsFileMode(true)}
							>
								Tệp tin
							</div>
						</div>
					</Col>
					<Col className="mx-0 p-2">
						<div className="p-0 m-0">
							<Row
								className="g-2 my-0 p-0"
								style={{
									overflowX: 'hidden',
									overflowY: 'scroll',
									height: 450
								}}
							>
								{files.map((file, index) => (
									<FileItem
										key={index}
										file={file}
										// Select
										selectedFile={selectedFile}
										setSelectedFile={setSelectedFile}
										onSelectFile={onSelectFile}
										// Update
										onRenameFile={handleRenameFile}
										// Delete
										onRemoveFile={handleRemoveFile}
									/>
								))}
							</Row>
						</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
};
