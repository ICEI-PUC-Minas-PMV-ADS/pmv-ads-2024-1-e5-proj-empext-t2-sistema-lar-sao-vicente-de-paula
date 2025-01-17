import { Controller, Delete, Param } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { ApiResponseError } from '@/common/decorators/api-response-error.decorator';
import { DeleteSemiologiaNutricionalService } from '../services/delete-semiologia-nutricional.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { RoleRelatorioNutricional } from '@/common/enums/roles';

@ApiTags('semiologia-nutricional')
@Controller('semiologia-nutricional')
@ApiBearerAuth()
export class DeleteSemiologiaNutricionalController {
	constructor(
		private deleteSemiologiaNutricional: DeleteSemiologiaNutricionalService,
	) {}

	@Delete(':uid')
	@Roles(RoleRelatorioNutricional.DELETE)
	@ApiOperation({
		summary: 'Exclui uma Semiologia Nutricional pelo UID',
	})
	@ApiParam({
		name: 'uid',
		description: 'UID da Semiologia Nutricional a ser excluída',
		type: 'string',
	})
	@ApiResponseError()
	async handle(@Param('uid') uid: string): Promise<void> {
		await this.deleteSemiologiaNutricional.execute(uid);

		return;
	}
}
