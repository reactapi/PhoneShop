import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export const StatisticItem = props => {
	const { color, icon, title, value } = props;

	return (
		<Col lg={4}>
			<Card
				className={`card border-0 border-start border-3 border-${color} shadow h-100`}
			>
				<Card.Body>
					<Row>
						<Col>
							<div
								className={`fw-bold text-${color} text-uppercase`}
							>
								{title}
							</div>
							<div className="fw-bold text-gray-800">{value}</div>
						</Col>
						<Col xs="auto" className="ms-2">
							<i className={`fa-2x text-gray-300 ${icon}`} />
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
};
